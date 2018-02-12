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

export default class OraStore {
  // stores
  crawler = new CrawlerStore()
  stack = new StackStore([{ type: 'main', id: 0 }])
  ui = new UIStore({ oraStore: this })
  pin = new PinStore()
  search = new SearchStore({ useWorker })
  screen = this.props.screen

  // helpers
  get results() {
    return this.stack.last.results
  }

  get searchResults() {
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

  get hasContext() {
    return this.stack.length > 1
  }

  get activeStore() {
    return this.stack.last.store
  }

  get desktopState() {
    const { desktopState } = this.props.screen
    // dont treat itself as a desktopState source
    if (
      desktopState.name &&
      (desktopState.name.toLowerCase() === 'electron' ||
        desktopState.name.toLowerCase() === 'orbit')
    ) {
      return null
    }
    return desktopState
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
    // start watching for context
    this.props.screen.start()
    // helper
    window.oraStore = this
    // listeners/watchers
    this._listenForKeyEvents()
    this._watchScreenForContext()
    this._watchClickPrevent()
    this.watch(function setDocuments() {
      this.search.setDocuments(this.things || [])
    }, 16)
    // watch and set active search
    this.watch(function setSearchQuery() {
      const { desktopState } = this
      if (Object.keys(desktopState || {}).length && !this.ui.barFocused) {
        if (desktopState.selection) {
          this.search.setQuery(desktopState.selection)
          return
        }
        if (desktopState.title) {
          this.search.setQuery(desktopState.title)
          return
        }
        if (desktopState.name) {
          this.search.setQuery(desktopState.name)
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

  _watchClickPrevent = () => {
    // todo: re-enable if needed
    // let iters = 0
    // let resetItersTO
    // this.watch(() => {
    //   clearTimeout(resetItersTO)
    //   iters++
    //   this.electronState.lastMove
    //   if (iters > 3) {
    //     dragListeners.forEach(x => x(this.electronState.lastMove))
    //     resetItersTO = setTimeout(() => {
    //       iters = 0
    //     }, 500)
    //   }
    // })
  }

  _watchScreenForContext = () => {
    let lastStackItem
    this.watch(function watchScreen() {
      // determine navigation
      const { desktopState } = this
      if (!desktopState) {
        return
      }
      const title = desktopState.title || desktopState.name
      if (!title) {
        log('no context title', desktopState)
        return
      }
      const nextStackItem = contextToResult(desktopState)
      if (!nextStackItem.id) {
        console.log('no good id to update', nextStackItem)
        return
      }
      if (!isEqual(lastStackItem, nextStackItem)) {
        lastStackItem = nextStackItem
        const isAlreadyOnResultsPane = this.stack.length > 1
        if (isAlreadyOnResultsPane) {
          this.stack.replaceInPlace(nextStackItem)
        } else {
          this.stack.navigate(nextStackItem)
        }
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
