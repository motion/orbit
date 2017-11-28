import { Thing } from '~/app'
import { watch } from '@mcro/black'
import Mousetrap from 'mousetrap'
import { OS, debounceIdle } from '~/helpers'
import StackStore from '~/stores/stackStore'
import CrawlerStore from '~/stores/crawlerStore'
import keycode from 'keycode'
import ContextStore from '~/context'
import SHORTCUTS from './shortcuts'
import { CurrentUser } from '~/app'
import * as r2 from '@mcro/r2'
import { throttle } from 'lodash'
import debug from 'debug'
import { createInChunks } from '~/sync/helpers'

const log = _ => _ || debug('ora')

const BANNERS = {
  note: 'note',
  success: 'success',
  error: 'error',
}

const BANNER_TIMES = {
  note: 5000,
  success: 1500,
  error: 5000,
}

export default class OraStore {
  stack = new StackStore([{ type: 'main' }])
  inputRef = null
  search = ''
  textboxVal = ''
  traps = {}
  lastKey = null
  banner = null
  focusedBar = false
  wasBlurred = false
  showWhiteBottomBg = false
  crawler = new CrawlerStore()
  lastContext = null

  // this is synced to electron!
  state = {
    hidden: false,
    focused: true,
  }

  // synced from electron!
  electronState = {}

  setState = newState => {
    this.state = {
      ...this.state,
      ...newState,
    }
    OS.send('set-state', this.state)
  }

  // TODO move into currentuser
  get bucket() {
    if (!CurrentUser.user) {
      return 'Default'
    }
    const { activeBucket } = CurrentUser.user.settings
    return activeBucket || 'Default'
  }

  @watch
  items = () =>
    !this.bucket
      ? Thing.find().limit(8)
      : Thing.find()
          .limit(8)
          .where('bucket')
          .eq(this.bucket)
          .sort({ updatedAt: 'desc' })

  @watch context = () => this.items && new ContextStore(this.items)

  async willMount() {
    this.attachTrap('window', window)
    // listeners
    this._listenForStateSync()
    this.on(OS, 'ora-toggle', this.toggleHidden)
    // watchers
    this._watchContext()
    this._watchFocus()
    this._watchFocusBar()
    this._watchBlurBar()
    this.watch(function watchWasBlurred() {
      const { focused } = this.state
      // one frame later
      this.setTimeout(() => {
        this.wasBlurred = !focused
      }, 16)
    })
    this.setState({}) // trigger first send
    OS.send('start-ora')
  }

  setBanner = (type, message, timeout) => {
    this.banner = { message, type }
    const fadeOutTime = timeout || BANNER_TIMES[type]
    if (fadeOutTime) {
      this.setTimeout(() => {
        if (
          this.banner &&
          this.banner.type === type &&
          this.banner.message === message
        ) {
          this.banner = null
        }
      }, fadeOutTime)
    }
  }

  get osContext() {
    return (
      this.electronState.context &&
      // ensure theres at least a title to the page
      this.electronState.context.title &&
      this.electronState.context
    )
  }

  addCurrentPage = async () => {
    if (!this.osContext) {
      console.log('no context to add')
      return
    }
    this.setBanner(BANNERS.note, 'Pinning...')
    const { url } = this.osContext
    const response = await r2.post('http://localhost:3001/crawler/single', {
      json: { options: { entry: url } },
    }).json
    if (response.error) {
      this.setBanner(BANNERS.error, `${response.error}`)
      return
    }
    const { result } = response
    if (result) {
      const { url } = result
      const { title, content } = result.contents
      const thing = await Thing.create({
        title,
        integration: 'pin',
        type: 'site',
        body: content,
        url,
        bucket: this.bucket || 'Default',
      })
      console.log('made a thing', thing)
      this.setBanner(BANNERS.success, 'Added pin')
    } else {
      this.setBanner(BANNERS.error, 'Failed pinning :(')
    }
  }

  _watchBlurBar = () => {
    this.watch(function watchBlurBar() {
      if (this.state.hidden) {
        // timeout based on animation
        this.setTimeout(this.blurBar, 150)
      }
    })
  }

  _listenForStateSync = () => {
    // allows electron to ask for updated app state
    this.on(OS, 'get-state', () => {
      OS.send('got-state', this.state)
    })
    // allows us to get updated electron state
    this.on(OS, 'electron-state', (event, state) => {
      this.electronState = state
    })
  }

  contextToResult = context => ({
    id: context.url,
    title: context.selection || context.title,
    type: 'context',
    icon: context.application === 'Google Chrome' ? 'social-google' : null,
    image: context.favicon,
  })

  _watchContext = () => {
    this.lastContext = null
    this.watch(function watchContext() {
      const { context } = this.electronState
      if (!context) {
        return
      }
      // fixes bug where empty string === true
      context.title = `${context.title}`.trim()
      if (!context.url || !context.title) {
        log('no context or url/title', this.context)
        return
      }
      if (this.lastContext) {
        if (this.lastContext.url === context.url) return
      }
      this.lastContext = context
      const nextStackItem = this.contextToResult(context)
      const isAlreadyOnResultsPane = this.stack.length > 1
      if (isAlreadyOnResultsPane) {
        this.stack.replaceInPlace(nextStackItem)
      } else {
        this.stack.navigate(nextStackItem)
      }
    })
  }

  _watchFocus() {
    this.on(OS, 'ora-focus', () => {
      this.focusedAt = Date.now()
      this.setState({ focused: true })
    })
    this.on(OS, 'ora-blur', () => {
      this.setState({ focused: false })
    })
  }

  commitResults = async () => {
    this.setBanner(BANNERS.note, 'Saving...')
    const { results } = this.crawler
    this.crawler.reset()
    if (results) {
      await createInChunks(results, ({ url, contents }) => {
        return Thing.create({
          url,
          title: `${contents.title}`,
          body: `${contents.content}`,
          integration: 'crawler',
          type: 'website',
          bucket: this.bucket || 'Default',
        })
      })
      this.setBanner(BANNERS.success, 'Saved results!')
    }
  }

  toggleHidden = throttle(
    () => this.setState({ hidden: !this.state.hidden }),
    150
  )

  hide = () => {
    this.setState({ hidden: true })
  }

  _watchFocusBar() {
    let lastCol = null
    this.watch(function watchFocusBar() {
      const { col } = this.stack
      if (col === 0 && lastCol !== 0) {
        this.focusBar()
      }
      if (col !== 0 && lastCol === 0) {
        this.blurBar()
      }
      lastCol = col
    })
  }

  onInputRef = el => {
    if (!el) {
      return
    }
    this.inputRef = el
    this.attachTrap('bar', el)
    this._watchKeyEvents()
  }

  _watchKeyEvents() {
    this.on(this.inputRef, 'keydown', e => {
      const key = (this.lastKey = keycode(e.keyCode))
      if (key === 'up' || key === 'down' || key === 'left' || key === 'right') {
        return
      }
      this.shouldFocus = true
      this.setTimeout(() => {
        if (this.shouldFocus) {
          this.stack.focus(0)
          this.shouldFocus = false
        }
      }, 150)
    })
  }

  focusBar = () => {
    if (this.inputRef) {
      this.inputRef.focus()
      this.inputRef.select()
      this.focusedBar = true
    }
  }

  blurBar = () => {
    this.inputRef && this.inputRef.blur()
    this.focusedBar = false
  }

  onSearchChange = e => {
    this.setTextboxVal(e.target.value)
  }

  setTextboxVal = value => {
    this.textboxVal = value
    this.setSearch(value)
  }

  setSearchImmediate = text => {
    this.search = text
    if (this.shouldFocus) {
      this.stack.focus(0)
      this.shouldFocus = false
    }
  }

  setSearch = debounceIdle(this.setSearchImmediate, 20)

  attachTrap(attachName, el) {
    this.traps[attachName] = new Mousetrap(el)
    for (const name of Object.keys(SHORTCUTS)) {
      const chord = SHORTCUTS[name]
      this.traps[attachName].bind(chord, event => {
        this.emit('shortcut', name)
        if (this.actions[name]) {
          this.actions[name](event)
        }
      })
    }
  }

  actions = {
    openSettings: () => {
      OS.send('open-settings')
    },
    down: e => {
      if (this.stack.col === 0) {
        e.preventDefault()
      }
      this.stack.down()
    },
    up: e => {
      if (this.stack.col === 0) {
        e.preventDefault()
      }
      this.stack.up()
    },
    esc: e => {
      if (this.inputRef === document.activeElement) {
        if (this.textboxVal !== '') {
          this.setTextboxVal('')
        }
        this.inputRef.blur()
        return
      }
      if (this.search === '') {
        e.preventDefault()
        this.hide()
      }
    },
    cmdA: () => {
      this.inputRef.select()
    },
    enter: e => {
      e.preventDefault()
      if (this.stack.selected && this.stack.selected.static) {
        console.log('static item, no action')
        return
      }
      if (this.stack.selected.onSelect) {
        this.stack.selected.onSelect()
      }
    },
    cmdL: () => {
      this.focusBar()
    },
    delete: () => {
      if (this.textboxVal === '') {
        this.stack.left()
      }
    },
    right: e => {
      e.preventDefault()
      this.stack.right()
    },
    left: e => {
      e.preventDefault()
      this.stack.left()
    },
  }
}
