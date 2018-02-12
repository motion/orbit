import { store } from '@mcro/black'
import { OS } from '~/helpers'
import SHORTCUTS from './shortcuts'
import Mousetrap from 'mousetrap'
import * as Helpers from '~/helpers'
import keycode from 'keycode'
import * as Constants from '~/constants'
import * as _ from 'lodash'
import pluralize from 'pluralize'
import whatKey from 'whatkey'

export SHORTCUTS from './shortcuts'

@store
export default class UIStore {
  _inputRefVersion = 0
  _inputRef = null
  barFocused = false
  collapsed = false
  lastHeight = 'auto'
  _height = 'auto'
  search = ''
  textboxVal = ''
  traps = {}

  // sync this to screenStore.appState
  state = {
    pinned: false,
    // TODO: this can likely be removed and just use screenStore.electronState.focused
    hidden: false,
    preventElectronHide: true,
    contextMessage: 'Orbit',
  }

  get inputRef() {
    this._inputRefVersion
    return this._inputRef
  }

  set inputRef(val) {
    this._inputRefVersion++
    this._inputRef = val
  }

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
    const { hidden, pinned } = this.state
    return pinned || !hidden
  }

  constructor({ oraStore }) {
    console.log('constructo ui', oraStore)
    this.oraStore = oraStore
    this.stack = oraStore.stack
    this.attachTrap('window', window)
    this.on(OS, 'ora-toggle', this.toggleHidden)
    this.setState({}) // trigger first send
  }

  willMount() {
    this._watchHeight()
    this._watchKeyboardFocus()
    this._watchBarFocus()
    this._watchBlurBarOnHide()
    this._watchKeyEvents()
    this._watchContextMessage()
    this._watchTrayTitle()
  }

  dispose() {
    Mousetrap.reset()
    if (super.dispose) {
      super.dispose()
    }
  }

  handleSearchKeyDown = e => {
    e.preventDefault()
    const { key, char } = whatKey(e)
    console.log('got', key, char)
    if (!key) {
      return
    }
    if (key === 'backspace') {
      this.setTextboxVal(this.textboxVal.slice(0, this.textboxVal.length - 1))
    } else {
      if (key.length === 1) {
        this.setTextboxVal((this.textboxVal += char))
      }
    }
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
        this.setState({
          contextMessage: contextMessage.join(', '),
        })
      }
    })
  }

  togglePinned = () => {
    this.setState({ pinned: !this.state.pinned })
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
        this.state = {
          ...this.state,
          contextMessage,
        }
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
        OS.send('peek-target', null)
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

  setState = newState => {
    this.state = {
      ...this.state,
      ...newState,
    }
    // send screenStore.appState
    this.oraStore.screen.setState({
      appState: this.state,
    })
  }

  handleInputRef = ref => {
    if (ref && this.inputRef !== ref) {
      this.inputRef = ref
      this.attachInputHandlers(ref)
    }
  }

  attachInputHandlers = ref => {
    // reset before attach
    if (this.inputDisposables) {
      this.inputDisposables.map(x => x())
    }
    this.inputDisposables = [
      this.on(ref, 'focus', this.focusBar),
      this.on(ref, 'blur', this.blurBar),
      this.on(ref, 'keydown', this.emitKeyCode),
      this.attachTrap('bar', ref),
    ]
  }

  emitKeyCode = e => this.emit('keydown', keycode(e.keyCode))

  toggleHidden = _.throttle(
    () => this.setState({ hidden: !this.state.hidden, pinned: false }),
    40,
  )

  hide = () => {
    this.setState({ hidden: true })
  }

  _watchBarFocus() {
    let lastState = this.barFocused
    this.watch(() => {
      const { inputRef, barFocused } = this
      if (barFocused === lastState) {
        return
      }
      lastState = barFocused
      if (!inputRef) {
        return
      }
      if (barFocused) {
        inputRef.focus()
        inputRef.select()
      } else {
        inputRef.blur()
      }
    })
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
      if (this.state.hidden) {
        // timeout based on animation
        this.setTimeout(this.blurBar, 150)
        OS.send('peek-target', null)
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
