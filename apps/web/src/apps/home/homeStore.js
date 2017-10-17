import { watch } from '@mcro/black'
import { Thing } from '~/app'
import { find } from 'lodash'
import { SHORTCUTS } from '~/stores/rootStore'
import Mousetrap from 'mousetrap'
import { OS } from '~/helpers'
import StackStore from './stackStore'
//import { debounce } from 'lodash'
import keycode from 'keycode'

const debounce = (fn, timeout) => {
  let clearId = null
  return (...args) => {
    if (clearId) cancelIdleCallback(clearId)

    clearId = requestIdleCallback(() => fn(...args), { timeout })
  }
}

const peeks = [
  'remind',
  'send',
  'attach',
  'discuss',
  'assign',
  'update',
  'new',
  'issues',
  'docs',
].sort()

export default class HomeStore {
  stack = new StackStore([{ type: 'main' }])
  inputRef = null
  search = ''
  textboxVal = ''
  fullscreen = false
  traps = {}
  lastKey = null

  @watch
  myrecent = () =>
    Thing.find()
      .where('author')
      .in(['natew'])
      .sort({ updated: 'desc' })
      .limit(5)

  willMount() {
    window.homeStore = this
    this.attachTrap('window', window)
    this._watchFocusBar()
    this._watchInput()
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

  get peekItem() {
    return find(peeks, peek => peek.indexOf(this.search) === 0)
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
        console.log('prevnted')
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
        OS.send('bar-hide')
      }
    },
    cmdA: () => {
      this.inputRef.select()
    },
    enter: e => {
      e.preventDefault()
      if (this.stack.selected.static) {
        console.log('static item, no action')
        return
      }
      if (this.stack.selected.onSelect) {
        this.stack.selected.onSelect()
      } else {
        const schema = JSON.stringify(this.stack.selected)
        // OS.send('bar-goto', `http://jot.dev/master?schema=${schema}`)
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
    fullscreen: () => {
      this.fullscreen = !this.fullscreen
    },
  }
}
