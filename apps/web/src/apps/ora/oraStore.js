import { watch } from '@mcro/black'
import { Thing } from '~/app'
import Mousetrap from 'mousetrap'
import { OS } from '~/helpers'
import StackStore from '../home/stackStore'
import keycode from 'keycode'

export const SHORTCUTS = {
  left: 'left',
  right: 'right',
  down: 'down',
  up: 'up',
  j: 'j', // down
  k: 'k', // up
  d: 'd', // doc
  enter: 'enter',
  esc: 'esc',
  explorer: ['command+t'],
  cmdA: 'command+a',
  cmdL: 'command+l',
  cmdEnter: 'command+enter',
  cmdUp: 'command+up',
  cmdR: 'command+r',
  delete: ['delete', 'backspace'],
  togglePane: 'shift+tab',
  fullscreen: ['command+b', 'command+\\'],
}

const debounce = (fn, timeout) => {
  let clearId = null
  return (...args) => {
    if (clearId) cancelIdleCallback(clearId)

    clearId = requestIdleCallback(() => fn(...args), { timeout })
  }
}

export default class HomeStore {
  stack = new StackStore([{ type: 'oramain' }])
  inputRef = null
  search = ''
  textboxVal = ''
  traps = {}
  lastKey = null
  hidden = false
  focused = false

  willMount() {
    window.homeStore = this
    this.attachTrap('window', window)
    this._watchFocusBar()
    this._watchInput()
    this._watchToggleHide()
  }

  _watchToggleHide() {
    OS.send('start-ora')

    OS.on('show-ora', () => {
      this.hidden = !this.hidden
    })
  }

  hide = () => {
    this.hidden = true
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
    }
  }

  onSearchChange = e => {
    this.textboxVal = e.target.value
    this.setSearch(this.textboxVal)
  }

  setSearch = debounce(text => {
    this.search = text
    if (this.shouldFocus) {
      this.stack.focus(0)
      this.shouldFocus = false
    }
  }, 20)

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

  blurBar() {
    this.inputRef && this.inputRef.blur()
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
      } else {
        // const schema = JSON.stringify(this.stack.selected)
        // OS.send('bar-goto', `http://jot.dev/master?schema=${schema}`)
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
