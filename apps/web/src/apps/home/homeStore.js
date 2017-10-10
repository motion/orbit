import { isNumber, find } from 'lodash'
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
    this.attachTrap('window', window)
    this.watchFocusBar()
  }

  // public

  get peekItem() {
    return find(peeks, peek => peek.indexOf(this.search) === 0)
  }

  get hasSelectedItem() {
    return isNumber(this.activeRow)
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
    this.textboxVal = e.target.value
    this.setSearch(this.textboxVal)
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
    this.search = text
    // this.millerStore.setActiveRow(0)
  }

  actions = {
    down: e => {
      // this.down()
      e.preventDefault()
    },
    up: e => {
      if (this.activeRow > 0) {
        // this.up()
      }
      e.preventDefault()
    },
    esc: e => {
      e.preventDefault()
      if (this.activeAction) {
        // this.millerStore.setActiveAction(null)
        return
      }
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
      if (this.activeAction) {
        return
      }
      if (this.currentItem.static) {
        console.log('static item, no action')
        return
      }
      if (this.currentItem.onSelect) {
        this.currentItem.onSelect()
      } else {
        const schema = JSON.stringify(this.currentItem)
        OS.send('bar-goto', `http://jot.dev/master?schema=${schema}`)
      }
    },
    right: e => {
      if (this.hasSelectedItem) {
        // this.millerKeyActions.right()
        e.preventDefault()
      } else {
        if (this.peekItem) {
          this.search = this.peekItem
        }
      }
    },
    left: e => {
      if (this.hasSelectedItem) {
        // this.millerKeyActions.left()
        e.preventDefault()
      }
    },
    fullscreen: () => {
      this.fullscreen = !this.fullscreen
    },
  }
}
