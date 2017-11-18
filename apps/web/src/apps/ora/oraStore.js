import { Thing } from '~/app'
import { watch } from '@mcro/black'
import Mousetrap from 'mousetrap'
import { OS, debounceIdle } from '~/helpers'
import StackStore from '~/stores/stackStore'
import keycode from 'keycode'
import ContextStore from '~/context'
import SHORTCUTS from './shortcuts'
import { CurrentUser } from '~/app'
import * as r2 from '@mcro/r2'

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
  stack = new StackStore([{ type: 'oramain' }])
  inputRef = null
  osContext = null
  search = ''
  textboxVal = ''
  traps = {}
  lastKey = null
  banner = null
  focusedBar = false
  wasBlurred = false
  showWhiteBottomBg = false

  // this is synced to electron!
  state = {
    hidden: false,
    focused: true,
  }

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
      ? Thing.find()
      : Thing.find()
          .where('bucket')
          .eq(this.bucket)

  @watch context = () => this.items && new ContextStore(this.items)

  async willMount() {
    this.attachTrap('window', window)

    this._listenForStateSync()
    this._listenForContext()
    // side effect watchers
    this._watchFocus()
    this._watchFocusBar()
    this._watchInput()
    this._watchToggleHide()
    this._watchMouse()
    this._watchBlurBar()

    this.watch(() => {
      const { focused } = this.state
      // one frame later
      this.setTimeout(() => {
        this.wasBlurred = !focused
      }, 16)
    })
  }

  setBanner = (type, message, timeout) => {
    this.banner = { message, type }
    const fadeOutTime = timeout || BANNER_TIMES[type]
    if (fadeOutTime) {
      this.setTimeout(() => {
        if (this.banner.type === type && this.banner.message === message) {
          this.banner = null
        }
      }, fadeOutTime)
    }
  }

  addCurrentPage = async () => {
    if (!this.osContext) {
      return
    }
    this.setBanner(BANNERS.note, 'Pinning...')
    const token = `e441c83aed447774532894d25d97c528`
    const { url } = this.osContext
    const toFetch = `https://api.diffbot.com/v3/article?token=${token}&url=${
      url
    }`
    const res = await fetch(toFetch).then(res => res.json())
    if (res.error) {
      this.setBanner(BANNERS.error, `Diffbot: ${res.error}`)
      return
    }
    console.log('got res', res)
    const { text, title } = res.objects[0]
    const thing = await Thing.create({
      title,
      integration: 'manual',
      type: 'manual',
      body: text,
      url,
    })
    this.setBanner(BANNERS.success, 'Added pin')
    return thing
  }

  _watchBlurBar = () => {
    this.watch(() => {
      if (this.state.hidden) {
        // timeout based on animation
        this.setTimeout(this.blurBar, 100)
      }
    })
  }

  _listenForStateSync = () => {
    this.on(OS, 'get-state', () => {
      OS.send('got-state', this.state)
    })
  }

  _listenForContext = () => {
    // check
    this.setInterval(() => {
      OS.send('get-context')
    }, 300)
    // response
    this.on(OS, 'set-context', (event, info) => {
      const context = JSON.parse(info)
      if (!context) {
        if (this.stack.last.result.type === 'context') {
          // this.osContext = null
          // if you want it to navigate back home automatically
          // this.stack.pop()
        }
        return
      }
      if (!context || !context.url || !context.title) {
        log('no context or url/title', this.osContext)
        return
      }

      const updateContext = title => {
        this.osContext = context
        // if were at home, move into a new pane
        // otherwise, no need to push a new pane
        if (this.stack.length === 1) {
          const nextStackItem = {
            id: context.url,
            title: title || context.title,
            type: 'context',
            icon:
              context.application === 'Google Chrome' ? 'social-google' : null,
          }
          this.stack.navigate(nextStackItem)
        }
      }

      // update logic
      if (!this.osContext) {
        return updateContext()
      }
      const hasNewTitle = this.osContext.title !== context.title
      const hasNewFocusedApp =
        this.osContext.application !== context.application
      if (hasNewTitle || hasNewFocusedApp) {
        return updateContext()
      }
      const hasNewSelection = this.osContext.selection !== context.selection
      if (hasNewSelection) {
        return updateContext(context.selection)
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

  startCrawl = async options => {
    console.log('starting crawl', options)
    const results = await r2.post('http://localhost:3001/crawler/start', {
      json: { options },
    }).json
    console.log('crawl done', results)
    let creating = []
    if (results) {
      for (const { url, contents } of results.results) {
        console.log('creating a thing', url, contents)
        creating.push(
          Thing.create({
            url,
            title: contents.title,
            body: contents.body,
            integration: 'crawler',
            type: 'website',
            bucket: this.bucket || 'Default',
          })
        )
      }
    }
    return await Promise.all(creating)
  }

  stopCrawl = async () => {
    const response = await r2.post('http://localhost:3001/crawler/stop').json
    return response && response.success
  }

  _watchMouse() {
    OS.send('mouse-listen')
    this.on(OS, 'mouse-in-corner', () => {
      if (this.state.hidden) {
        this.setState({ hidden: false })
      }
    })
  }

  _watchToggleHide() {
    OS.send('start-ora')
    this.on(OS, 'ora-toggle', () => {
      this.setState({ hidden: !this.state.hidden })
    })
  }

  hide = () => {
    this.setState({ hidden: true })
  }

  _watchInput() {
    let lastChar = null
    this.watch(() => {
      const char = this.search[this.search.length - 1]
      if (lastChar && this.search.length === 0) {
        this.emit('clearSearch')
      }
      if (!lastChar && this.search.length) {
        this.emit('startSearch')
      }
      lastChar = char
    })
  }

  _watchFocusBar() {
    let lastCol = null
    this.watch(() => {
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
