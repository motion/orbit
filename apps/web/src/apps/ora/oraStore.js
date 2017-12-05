import { Thing } from '~/app'
import { OS } from '~/helpers'
import StackStore from '~/stores/stackStore'
import CrawlerStore from '~/stores/crawlerStore'
import ContextStore from '~/stores/contextStore'
import PinStore from '~/stores/pinStore'
import UIStore from '~/stores/uiStore'
import { CurrentUser } from '~/app'
import debug from 'debug'

const log = _ => _ || debug('ora')

const BANNER_TIMES = {
  note: 5000,
  success: 1500,
  error: 5000,
}

const contextQuery = () =>
  !CurrentUser.bucket
    ? Thing.find().limit(8)
    : Thing.find()
        .limit(8)
        .where('bucket')
        .eq(CurrentUser.bucket)
        .sort({ updatedAt: 'desc' })

export default class OraStore {
  // stores
  crawler = new CrawlerStore()
  stack = new StackStore([{ type: 'main' }])
  ui = new UIStore({ stack: this.stack })
  pin = new PinStore()
  context = new ContextStore({
    query: contextQuery,
  })
  // state
  banner = null
  lastContext = null
  // synced from electron
  electronState = {}

  async willMount() {
    window.oraStore = this
    this._watchForBanners()
    this._listenForElectronState()
    this._watchContext()
    OS.send('start-ora')
  }

  willUnmount() {
    this.crawler.dispose()
    this.stack.dispose()
    this.ui.dispose()
    this.context.dispose()
    this.pin.dispose()
  }

  _watchForBanners = () => {
    this.on(this.pin, 'banner', this.setBanner)
    this.on(this.crawler, 'banner', this.setBanner)
  }

  setBanner = ({ type, message, timeout }) => {
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

  _listenForElectronState() {
    // allows electron to ask for updated app state
    this.on(OS, 'get-state', () => {
      OS.send('got-state', this.state)
    })
    // allows us to get updated electron state
    this.on(OS, 'electron-state', (event, state) => {
      this.electronState = state
    })
  }

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
