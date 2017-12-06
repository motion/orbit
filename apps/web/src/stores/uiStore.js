import { store } from '@mcro/black'
import * as Constants from '~/constants'
import { OS } from '~/helpers'
import { throttle } from 'lodash'
import SHORTCUTS from './shortcuts'
import Mousetrap from 'mousetrap'
import { debounceIdle } from '~/helpers'
import keycode from 'keycode'

export SHORTCUTS from './shortcuts'

@store
export default class UIStore {
  inputRef = null
  wasBlurred = false
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

  // this is synced to electron!
  state = {
    hidden: false,
    focused: true,
  }

  constructor({ stack }) {
    this.stack = stack
    this.attachTrap('window', window)
    this.on(OS, 'ora-toggle', this.toggleHidden)
    this._watchHeight()
    this._watchFocus()
    this._watchFocusBar()
    this._watchWasBlurred()
    this._watchBlurBar()
    this._watchKeyEvents()
    this.setState({}) // trigger first send
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

  attachTrap(ns, el) {
    if (this.traps[ns]) {
      this.traps[ns].reset()
    }
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
  }

  actions = {
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
    cmdL: () => {
      this.focusBar(true)
    },
  }

  setState = newState => {
    this.state = {
      ...this.state,
      ...newState,
    }
    OS.send('set-state', this.state)
  }

  onInputRef = el => {
    if (el) {
      this.setupInputRef(el)
    }
  }

  emitKeyCode = e => this.emit('keydown', keycode(e.keyCode))

  setupInputRef = ref => {
    console.log('setting', ref)
    this.inputRef = ref
    if (this.offKeyCode) {
      this.offKeyCode()
    }
    const off = this.on(ref, 'keydown', this.emitKeyCode)
    this.offKeyCode = off
    this.attachTrap('bar', ref)
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

  toggleHidden = throttle(
    () => this.setState({ hidden: !this.state.hidden }),
    150
  )

  hide = () => {
    this.setState({ hidden: true })
  }

  focusBar = () => {
    if (this.inputRef) {
      this.inputRef.focus()
      this.inputRef.select()
      this.barFocused = true
    }
  }

  blurBar = () => {
    this.inputRef && this.inputRef.blur()
    this.barFocused = false
  }

  setBarFocus = val => {
    this.barFocused = val
  }

  toggleCollapsed = () => {
    this.collapsed = !this.collapsed
  }

  _watchBlurBar = () => {
    this.watch(function watchBlurBar() {
      if (this.state.hidden) {
        // timeout based on animation
        this.setTimeout(this.blurBar, 150)
      }
    })
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
        this.stack.last.results || [],
        this.stack.last.store && this.stack.last.store.minHeight,
      ],
      ([results, minHeight]) => {
        let height = 'auto'
        const length = results.length
        // TODO make this actually measure
        if (length > 0) {
          // header + footer height
          height = 74 + 40
          // first
          if (results[0].content) {
            height += 120
          } else {
            height += 53
          }
          // second
          if (length > 1) height += 120
          // ...rest
          if (length > 2) height += (length - 2) * 90
          // max height
          height = Math.min(Constants.ORA_HEIGHT, height)
        }
        if (minHeight) {
          if (typeof height === 'number') {
            height = Math.max(minHeight, height)
          } else {
            height = minHeight
          }
        }
        this.height = height
      }
    )
  }
}
