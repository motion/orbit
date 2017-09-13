// @flow

import { isNumber, find, debounce } from 'lodash'
import { SHORTCUTS } from '~/stores/rootStore'
import Mousetrap from 'mousetrap'
import { OS } from '~/helpers'
import peeks from './peeks'

export default class BarStore {
  inputRef: ?HTMLElement = null

  // search is throttled, textboxVal isn't
  search = ''
  textboxVal = ''

  _millerState = null
  setMillerState = val => {
    this._millerState = val
  }

  start() {
    this.attachTrap('window', window)

    let lastActiveCol = null
    this.watch(() => {
      const { activeCol } = this.millerState
      if (activeCol === 0 && lastActiveCol !== 0) {
        this.focusBar()
      }

      if (activeCol !== 0 && lastActiveCol === 0) {
        this.blurBar()
      }

      lastActiveCol = this.millerState.activeCol
    })
  }

  attachTrap = (name, el) => {
    const _name = `${name}Trap`
    this[_name] = new Mousetrap(el)
    for (const name of Object.keys(SHORTCUTS)) {
      if (this.actions[name]) {
        const chord = SHORTCUTS[name]
        this[_name].bind(chord, this.actions[name])
      }
    }
  }

  get millerState() {
    return this._millerState
    // return this.millerState
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

  blurBar = () => {
    this.inputRef && this.inputRef.blur()
  }

  setSearch = debounce(text => {
    this.search = text
    setTimeout(() => {
      this.millerState.setActiveRow(0)
    })
  }, 150)

  onSearchChange = e => {
    this.textboxVal = e.target.value
    this.setSearch(this.textboxVal)
  }

  get peekItem() {
    return find(peeks, peek => peek.indexOf(this.search) === 0)
  }

  get isBarActive() {
    return this.inputRef === document.activeElement
  }

  get hasSelectedItem() {
    return isNumber(this.millerState.activeRow)
  }

  // call these to send key to miller
  millerKeyActions = {}
  actions = {
    down: e => {
      this.millerKeyActions.down()
      e.preventDefault()
    },
    up: e => {
      if (this.millerState.activeRow > 0) {
        this.millerKeyActions.up()
      }

      e.preventDefault()
    },
    esc: e => {
      // if (this.isTextbox(e)) return
      e.preventDefault()

      if (this.millerState.activeAction) {
        this.millerState.setActiveAction(null)
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
      const { currentItem, activeAction } = this.millerState

      if (activeAction) return

      if (currentItem.static) {
        console.log('static item, no action')
        return
      }

      if (currentItem.onSelect) {
        currentItem.onSelect()
      } else {
        const schema = JSON.stringify(currentItem)
        OS.send('bar-goto', `http://jot.dev/master?schema=${schema}`)
      }
    },
    right: e => {
      if (this.hasSelectedItem) {
        this.millerKeyActions.right()
        e.preventDefault()
      } else {
        if (this.peekItem) this.search = this.peekItem
      }
    },
    left: e => {
      if (this.hasSelectedItem) {
        this.millerKeyActions.left()
        e.preventDefault()
      }
    },
  }
}
