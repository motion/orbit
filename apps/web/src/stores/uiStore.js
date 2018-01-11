import { store } from '@mcro/black'
import { OS } from '~/helpers'
import { throttle } from 'lodash'
import SHORTCUTS from './shortcuts'
import Mousetrap from 'mousetrap'
import { debounceIdle } from '~/helpers'
import keycode from 'keycode'
import * as Constants from '~/constants'
import * as _ from 'lodash'

export SHORTCUTS from './shortcuts'

@store
export default class UIStore {
  _inputRefVersion = 0
  _inputRef = null
  wasBlurred = false
  barFocused = false
  collapsed = false
  lastHeight = 'auto'
  _height = 'auto'
  search = ''
  textboxVal = ''
  traps = {}

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

  // this is synced to electron!
  state = {
    hidden: false,
    focused: true,
    preventElectronHide: true,
  }

  constructor({ stack }) {
    this.stack = stack
    this.attachTrap('window', window)
    this.on(OS, 'ora-toggle', this.toggleHidden)
    this._listenForFocus()
    this.setState({}) // trigger first send
  }

  willMount() {
    this._watchHeight()
    this._watchKeyboardFocus()
    this._watchBarFocus()
    this._watchWasBlurred()
    this._watchBlurBarOnHide()
    this._watchKeyEvents()
  }

  dispose() {
    Mousetrap.reset()
    if (super.dispose) {
      super.dispose()
    }
  }

  handleSearchChange = e => {
    this.setTextboxVal(e.target.value)
  }

  setTextboxVal = value => {
    this.textboxVal = value
    this.setSearch(value)
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

  setSearch = debounceIdle(this.setSearchImmediate, 20)

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
    OS.send('set-state', this.state)
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

  _listenForFocus() {
    this.on(OS, 'ora-focus', () => {
      this.focusedAt = Date.now()
      this.setState({ focused: true })
    })
    this.on(OS, 'ora-blur', () => {
      this.setState({ focused: false })
    })
  }

  toggleHidden = throttle(
    () => this.setState({ hidden: !this.state.hidden }),
    50,
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

  _watchWasBlurred() {
    this.watch(function watchWasBlurred() {
      const { focused } = this.state
      // one frame later
      this.setTimeout(() => {
        this.wasBlurred = !focused
      }, 16)
    })
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

    const newHeight = Math.min(Constants.ORA_HEIGHT, height)
    if (this.height !== newHeight) {
      this.height = newHeight
    }
  }, 32)
}
