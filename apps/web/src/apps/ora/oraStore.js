import { watch } from '@mcro/black'
import { Thing } from '~/app'
import { OS, contextToResult } from '~/helpers'
import StackStore from '~/stores/stackStore'
import CrawlerStore from '~/stores/crawlerStore'
import PinStore from '~/stores/pinStore'
import UIStore from '~/stores/uiStore'
import SearchStore from '~/stores/searchStore'
import { CurrentUser } from '~/app'
import debug from 'debug'
import After from '~/views/after'
import { isEqual } from 'lodash'

const log = _ => _ || debug('ora')
const useWorker = window.location.href.indexOf('?noWorker')

// hacky
// for gloss fancyElement
let dragListeners = []
window.addDragListener = window.addDragListener || (x => dragListeners.push(x))

window.lastElectronState = {}

export default class OraStore {
  // helpers
  electronStateBus = new BroadcastChannel('ora-electron-state')
  // stores
  crawler = new CrawlerStore()
  stack = new StackStore([{ type: 'main', id: 0 }])
  ui = new UIStore({ stack: this.stack })
  pin = new PinStore()
  search = new SearchStore({ useWorker })
  // state
  lastContext = null

  // synced from electron
  // see @mcro/electron/src/views/Windows#Windows.state
  electronState = {}

  // helper to show currently focused results
  get results() {
    return this.stack.last.results
  }

  get contextResults() {
    return this.search.results
      .slice(0, 6)
      .map(({ subtitle, highlightWords, document, snippet }) => ({
        ...Thing.toResult(document),
        highlightWords,
        subtitle,
        children: snippet,
        after: <After navigate={this.stack.navigate} thing={document} />,
      }))
  }

  @watch
  things = () =>
    !CurrentUser.bucket
      ? Thing.find().limit(500)
      : Thing.find()
          .limit(500)
          .where('bucket')
          .eq(CurrentUser.bucket)
          .sort({ updatedAt: 'desc' })

  async willMount() {
    window.oraStore = this
    this._listenForElectronState()
    this._listenForKeyEvents()
    this._watchContext()
    this._watchClickPrevent()

    this.watch(function setDocuments() {
      this.search.setDocuments(this.things || [])
    }, 16)

    this.watch(function setSearchQuery() {
      if (this.osContext && !this.ui.barFocused) {
        if (this.osContext.selection) {
          this.search.setQuery(this.osContext.selection)
          return
        }
        if (this.osContext.title) {
          this.search.setQuery(this.osContext.title)
          return
        }
      } else {
        this.search.setQuery(this.ui.search)
      }
    })

    OS.send('start-ora')
  }

  willUnmount() {
    this.crawler.dispose()
    this.stack.dispose()
    this.ui.dispose()
    this.pin.dispose()
    this.search.dispose()
  }

  // synced from electron
  // see @mcro/electron/src/helpers/getContext
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
      window.lastElectronState = state
    })
  }

  _watchClickPrevent = () => {
    let iters = 0
    let resetItersTO
    this.watch(() => {
      clearTimeout(resetItersTO)
      iters++
      this.electronState.lastMove
      if (iters > 3) {
        dragListeners.forEach(x => x(this.electronState.lastMove))
        resetItersTO = setTimeout(() => {
          iters = 0
        }, 500)
      }
    })
  }

  _watchContext = () => {
    this.lastContext = null
    this.watch(function watchContext() {
      // send electron state over bus
      this.electronStateBus.postMessage(this.electronState)

      // determine navigation
      const { context } = this.electronState
      if (!context) {
        return
      }
      // fixes bug where empty string === true
      context.title = `${context.title}`.trim().replace(/\s{2,}/g, ' ')
      if (!context.url || !context.title) {
        log('no context or url/title', this.context)
        return
      }
      if (this.lastContext) {
        if (isEqual(this.lastContext, context)) {
          return
        }
      }
      this.lastContext = context
      const nextStackItem = contextToResult(context)
      const isAlreadyOnResultsPane = this.stack.length > 1
      if (isAlreadyOnResultsPane) {
        this.stack.replaceInPlace(nextStackItem)
      } else {
        this.stack.navigate(nextStackItem)
      }
    })
  }

  _listenForKeyEvents() {
    this.on(this.ui, 'shortcut', (name, event) => {
      if (this.actions[name]) {
        this.actions[name](event)
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
      this.ui.focusBar()
    },
    delete: () => {
      if (this.stack.textboxVal === '') {
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
