import { store } from '@mcro/black'
import SHORTCUTS from './shortcuts'
import Mousetrap from 'mousetrap'
import * as Helpers from '~/helpers'
import keycode from 'keycode'
import * as _ from 'lodash'
import pluralize from 'pluralize'
import Screen from '@mcro/screen'

export SHORTCUTS from './shortcuts'

@store
export default class UIStore {
  inputRef = null
  barFocused = false
  collapsed = false
  lastHeight = 'auto'
  _height = 'auto'
  search = ''
  textboxVal = ''
  traps = {}

  get height() {
    if (this.collapsed) {
      return 40
    }
    return this._height
  }

  set height(val) {
    this.lastHeight = this._height
    this._height = val
  }

  get showOra() {
    const { pinned, hidden } = Screen.state
    return pinned || !hidden
  }

  constructor({ oraStore }) {
    this.oraStore = oraStore
    this.stack = oraStore.stack
    this.attachTrap('window', window)
  }

  willMount() {
    this._watchHeight()
    this._watchKeyboardFocus()
    this._watchBlurBarOnHide()
    this._watchKeyEvents()
    this._watchContextMessage()
    this._watchTrayTitle()
    this.react(
      () => [Screen.electronState.shouldHide, Screen.electronState.shouldShow],
      ([shouldHide, shouldShow]) => {
        if (!shouldHide && !shouldShow) return
        const hidden = shouldHide > shouldShow
        Screen.setState({ hidden })
      },
      true,
    )
  }

  dispose() {
    Mousetrap.reset()
  }

  setTextboxVal = value => {
    this.textboxVal = value
    this.setSearch(value)
  }

  _watchTrayTitle() {
    this.watch(function watchTrayTitle() {
      const { stack } = this
      if (!stack.last || !stack.last.store) {
        return
      }
      const { store } = stack.last
      const { results } = store
      if (results && results.length) {
        const counts = results.reduce((acc, cur) => {
          const key = (cur.data && cur.data.type) || cur.type
          return {
            ...acc,
            // count similar to this type
            [key]: (acc[key] || 0) + 1,
          }
        }, {})

        const contextMessage = Object.keys(counts).map(
          key => `${counts[key]} ${_.capitalize(pluralize(key))}`,
        )
        Screen.setState({
          contextMessage: contextMessage.join(', '),
        })
      }
    })
  }

  togglePinned = () => {
    Screen.setState({ pinned: !Screen.state.pinned })
  }

  _watchContextMessage() {
    this.watch(function watchContextMessage() {
      const { activeStore, hasContext } = this.oraStore
      if (hasContext && activeStore && activeStore.title) {
        if (activeStore.results.length === 0) {
          return
        }
        const contextMessage = `${activeStore.title}: ${
          activeStore.results.length
        } items`
        Screen.setState({
          contextMessage,
        })
      }
    })
  }

  _watchKeyEvents() {
    this.on('keydown', key => {
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

  setSearchImmediate = text => {
    this.search = text
    if (this.shouldFocus) {
      this.stack.focus(0)
      this.shouldFocus = false
    }
  }

  setSearch = Helpers.debounceIdle(this.setSearchImmediate, 20)

  removeTrap(ns) {
    if (this.traps[ns]) {
      this.traps[ns].reset()
      delete this.traps[ns]
    }
  }

  attachTrap(ns, el) {
    this.removeTrap(ns)
    this.traps[ns] = new Mousetrap(el)
    for (const name of Object.keys(SHORTCUTS)) {
      const chord = SHORTCUTS[name]
      this.traps[ns].bind(chord, event => {
        this.emit('shortcut', name, event)
        if (this.actions[name]) {
          this.actions[name](event)
        }
      })
    }
    return () => this.removeTrap(ns)
  }

  actions = {
    esc: e => {
      if (!this.barFocused) {
        Screen.setState({ hoveredWord: null })
      }
      if (this.inputRef === document.activeElement) {
        if (this.textboxVal !== '') {
          this.setTextboxVal('')
        }
        this.blurBar()
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
    cmdL: () => {
      this.focusBar()
    },
  }

  emitKeyCode = e => this.emit('keydown', keycode(e.keyCode))

  toggleHidden = () => {
    console.log('toggleHidden')
    Screen.setState({ hidden: !Screen.state.hidden })
  }

  hide = () => {
    console.log('ui.hide')
    Screen.setState({ hidden: true })
  }

  focusBar = () => {
    this.barFocused = true
  }

  blurBar = () => {
    this.barFocused = false
  }

  toggleCollapsed = () => {
    this.collapsed = !this.collapsed
  }

  _watchBlurBarOnHide = () => {
    this.watch(function watchBlurBar() {
      if (Screen.state.hidden) {
        // timeout based on animation
        this.setTimeout(this.blurBar, 150)
        Screen.setState({ hoveredWord: null })
      }
    })
  }

  _watchKeyboardFocus() {
    let lastCol = null
    this.react(
      () => this.stack.col,
      col => {
        if (col === 0 && lastCol !== 0) {
          this.focusBar()
        }
        if (col !== 0 && lastCol === 0) {
          this.blurBar()
        }
        lastCol = col
      },
    )
  }

  _watchHeight = () => {
    this.react(
      () => [
        this.stack.last.results.map(r => r.id),
        this.stack.last.store && this.stack.last.store.finishedLoading,
      ],
      this.calcHeight,
      true,
    )
  }

  calcHeight = _.debounce(([_, finishedLoading]) => {
    if (finishedLoading === false) {
      return
    }
    // hacky ass setup for now
    const refs = [
      // header
      document.querySelector('.leftSide'),
      // titlebar
      document.querySelector('.fade:last-child .tab'),
      // body
      document.querySelector(
        '.fade:last-child .ReactVirtualized__Grid__innerScrollContainer',
      ) || document.querySelector('.fade:last-child .list .listinner'),
    ].filter(Boolean)

    const hasActions = this.stack.last.store && this.stack.last.store.actions
    if (hasActions) {
      refs.push(document.querySelector('.actions'))
    }
    const height = refs.map(ref => ref.clientHeight).reduce((a, b) => a + b, 0)

    const newHeight = Math.min(1000, height)
    if (this.height !== newHeight) {
      this.height = newHeight
    }
  }, 32)
}
