import { find } from 'lodash'
import { SHORTCUTS } from '~/stores/rootStore'
import Mousetrap from 'mousetrap'
import { OS } from '~/helpers'
import StackStore from './stackStore'

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

  willMount() {
    window.homeStore = this
    this.attachTrap('window', window)
    this.watchFocusBar()
  }

  // public

  get peekItem() {
    return find(peeks, peek => peek.indexOf(this.search) === 0)
  }

  onInputRef = el => {
    this.inputRef = el
    this.attachTrap('bar', el)
  }

  focusBar = () => {
    if (this.inputRef) {
      this.inputRef.focus()
      this.inputRef.select()
    }
  }

  onSearchChange = e => {
    this.setSearch(e.target.value)
  }

  // private

  watchFocusBar() {
    let lastActiveCol = null
    this.watch(() => {
      if (this.activeCol === 0 && lastActiveCol !== 0) {
        this.focusBar()
      }
      if (this.activeCol !== 0 && lastActiveCol === 0) {
        this.blurBar()
      }
      lastActiveCol = this.activeCol
    })
  }

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

  setSearch = text => {
    this.textboxVal = text
    this.search = text
  }

  actions = {
    down: e => {
      e.preventDefault()
      this.stack.down()
    },
    up: e => {
      e.preventDefault()
      this.stack.up()
    },
    esc: e => {
      e.preventDefault()
      if (this.search !== '') {
        this.search = ''
        this.textboxVal = ''
        return
      }
      OS.send('bar-hide')
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
        OS.send('bar-goto', `http://jot.dev/master?schema=${schema}`)
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
