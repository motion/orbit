import { react, on } from '@mcro/black'
import { App, Electron } from '@mcro/stores'
import * as Helpers from '../helpers'
import { AppStore } from './AppStore'
import { logger } from '@mcro/logger'
import { QueryStore } from './QueryStore'

const log = logger('selectionStore')

type Direction = 'left' | 'right' | 'up' | 'down'

type SelectionHandler = {
  getResult: (index: number) => any
  getNextIndex: (index: number, direction: Direction) => number
}

export class SelectionStore {
  props: {
    appStore: AppStore
    queryStore: QueryStore
  }

  highlightIndex = -1
  lastPinKey = ''
  selectEvent = ''
  quickIndex = 0
  nextIndex = -1
  leaveIndex = -1
  lastSelectAt = 0
  _activeIndex = -1
  handler: SelectionHandler = null

  willMount() {
    on(this, window, 'keydown', this.windowKeyDown)
    this.props.appStore.onPinKey(key => {
      if (key === 'Delete') {
        this.props.queryStore.setQuery('')
        return
      }
      const { query } = this.props.queryStore
      if (!this.lastPinKey || this.lastPinKey != query[query.length - 1]) {
        this.props.queryStore.setQuery(key)
      } else {
        this.props.queryStore.setQuery(query + key)
      }
      // this.lastPinKey = key
    })
    const disposeAppListen = App.onMessage(App.messages.CLEAR_SELECTED, () => {
      this.clearSelected()
    })
    this.subscriptions.add({
      dispose: () => {
        disposeAppListen()
      },
    })
  }

  get activeIndex() {
    this.lastSelectAt
    return this._activeIndex
  }

  set activeIndex(val) {
    this.lastSelectAt = Date.now()
    this._activeIndex = val
  }

  get hasActiveIndex() {
    return this.activeIndex > -1
  }

  get selectedItem() {
    if (this.handler) {
      return this.handler.getResult(this.activeIndex)
    }
    return null
  }

  resetActiveIndexOnNewSearchValue = react(
    () => this.props.queryStore.query,
    async (_, { sleep }) => {
      await sleep(16)
      this.clearSelected()
    },
  )

  clearSelectedOnLeave = react(
    () => [this.leaveIndex, Electron.hoverState.peekHovered],
    async ([leaveIndex, peekHovered], { sleep, when }) => {
      if (!peekHovered) {
        await sleep(100)
      }
      await when(() => !peekHovered)
      await sleep(100)
      if (leaveIndex === -1) {
        throw react.cancel
      }
      this.clearSelected()
    },
  )

  clearPeekOnInactiveIndex = react(
    () => this.activeIndex,
    () => {
      if (this.hasActiveIndex) {
        throw react.cancel
      }
      App.actions.clearPeek()
    },
  )

  resetActiveIndexOnPeekTarget = react(
    () => App.peekState.target,
    target => {
      if (target || !this.hasActiveIndex) {
        throw react.cancel
      }
      log(`ok clearing ${target} ${this.hasActiveIndex} ${this.activeIndex}`)
      this.clearSelected()
    },
  )

  // delay for speed of rendering
  updateActiveIndexToNextIndex = react(
    () => this.nextIndex,
    async (i, { sleep }) => {
      await sleep(32)
      this.activeIndex = i
    },
  )

  clearSelected = (clearPeek = true) => {
    this.leaveIndex = -1
    this.nextIndex = -1
    this.activeIndex = -1
    if (clearPeek) {
      App.actions.clearPeek()
    }
  }

  getHoverSettler = Helpers.hoverSettler({
    enterDelay: 40,
    betweenDelay: 40,
    onHovered: res => {
      // leave
      if (!res) {
        if (this.activeIndex !== -1) {
          this.leaveIndex = this.activeIndex
        }
        return
      }
      this.leaveIndex = -1
      this.toggleSelected(res.index)
    },
  })

  toggleSelected = index => {
    const isSame = this.activeIndex === index && this.activeIndex > -1
    if (isSame && App.peekState.target) {
      if (Date.now() - this.lastSelectAt < 70) {
        // ignore really fast double clicks
        console.log('isSame, ignore', index, this.activeIndex)
        return isSame
      }
      this.clearSelected()
    } else {
      if (typeof index === 'number') {
        this.nextIndex = index
      }
    }
    return false
  }

  move = (direction: Direction) => {
    if (!this.handler) {
      throw new Error('No handler for events')
    }
    const nextIndex = this.handler.getNextIndex(this.activeIndex, direction)
    if (nextIndex !== this.activeIndex) {
      this.toggleSelected(nextIndex)
    }
  }

  setSelectEvent = (val: string) => {
    this.selectEvent = val
  }

  setHandler = (handler: SelectionHandler) => {
    this.handler = handler
  }

  openSelected = () => {
    if (this.selectedItem) {
      this.props.appStore.open(this.selectedItem)
      return true
    }
    return false
  }

  setHighlightIndex = index => {
    this.highlightIndex = index
  }

  windowKeyDown = e => {
    const { keyCode } = e
    this.setSelectEvent('key')
    switch (keyCode) {
      case 37: // left
        this.move('left')
        return
      case 39: // right
        this.move('right')
        return
      case 40: // down
        this.move('down')
        return
      case 38: // up
        this.move('up')
        return
      case 13: // enter
        e.preventDefault()
        if (App.orbitState.inputFocused) {
          if (this.openSelected()) {
            return
          }
        }
        return
    }
  }
}
