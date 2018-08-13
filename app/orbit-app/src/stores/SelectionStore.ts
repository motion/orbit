import { react, on } from '@mcro/black'
import { App, Electron } from '@mcro/stores'
import * as Helpers from '../helpers'
import { AppStore } from './AppStore'
import { logger } from '@mcro/logger'
import { QueryStore } from './QueryStore'

const log = logger('selectionStore')

export class SelectionStore {
  props: {
    appStore: AppStore
    queryStore: QueryStore
  }

  lastPinKey = ''
  selectEvent = ''
  quickIndex = 0
  nextIndex = -1
  leaveIndex = -1
  lastSelectAt = 0
  _activeIndex = -1
  getResult = null

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
    if (this.getResult) {
      return this.getResult(this.activeIndex)
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

  resetActiveIndexOnKeyPastEnds = react(
    () => this.nextIndex,
    index => {
      if (index === -1) {
        this.activeIndex = this.nextIndex
      } else {
        const len = this.searchState.results.length
        if (index >= len) {
          this.nextIndex = len - 1
          this.activeIndex = this.nextIndex
        } else {
          throw react.cancel
        }
      }
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

  // clearIndexOnTarget = react(
  //   () => App.peekState.target,
  //   target => {
  //     if (target) {
  //       throw react.cancel
  //     }
  //     this.nextIndex = -1
  //   },
  // )

  setSelectEvent = (val: string) => {
    this.selectEvent = val
  }

  increment = (by = 1) => {
    this.setSelectEvent('key')
    const max = this.searchState.results.length - 1
    // dont go past end
    if (this.nextIndex === max) {
      return
    }
    this.toggleSelected(Math.min(max, this.nextIndex + by))
  }

  decrement = (by = 1) => {
    this.setSelectEvent('key')
    this.toggleSelected(Math.max(-1, this.nextIndex - by))
  }

  setGetResult = fn => {
    this.getResult = fn
  }

  openSelected = () => {
    if (this.selectedItem) {
      this.props.appStore.open(this.selectedItem)
      return true
    }
    return false
  }

  windowKeyDown = e => {
    const { keyCode } = e
    switch (keyCode) {
      case 37: // left
        if (this.isInCarousel) {
          this.decrement()
          return
        }
        this.emit('key', 'left')
        return
      case 39: // right
        if (this.isInCarousel) {
          this.increment()
          return
        }
        this.emit('key', 'right')
        return
      case 40: // down
        this.increment()
        return
      case 38: // up
        this.decrement()
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
