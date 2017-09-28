import { isNumber, find, debounce } from 'lodash'
import { SHORTCUTS } from '~/stores/rootStore'
import Mousetrap from 'mousetrap'
import { OS } from '~/helpers'
import peeks from './peeks'

export default class BarStore {
  inputRef = null
  // search is throttled, textboxVal isn't
  search = ''
  textboxVal = ''
  smartRes = []
  resultCount = 0
  filters = {}

  _millerStore = null
  setMillerStore = val => {
    this._millerStore = val
  }

  willMount() {
    this.attachTrap('window', window)

    let lastActiveCol = null
    this.watch(() => {
      if (!this.millerStore) {
        return
      }
      const { activeCol } = this.millerStore
      if (activeCol === 0 && lastActiveCol !== 0) {
        this.focusBar()
      }

      if (activeCol !== 0 && lastActiveCol === 0) {
        this.blurBar()
      }

      lastActiveCol = this.millerStore.activeCol
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

  get millerStore() {
    return this._millerStore
    // return this.millerStore
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

  onClickBar = () => {
    // if they click the pane, activate main again
    if (this.millerStore.activeCol > 0) {
      this.millerStore.setSelection(0, this.millerStore.prevActiveRows[0])
    }
  }

  blurBar = () => {
    this.inputRef && this.inputRef.blur()
  }

  setSearch = text => {
    this.search = text
    this.millerStore.setActiveRow(0)
  }

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
    return isNumber(this.millerStore.activeRow)
  }

  // call these to send key to miller
  millerKeyActions = {}
  actions = {
    down: e => {
      this.millerKeyActions.down()
      e.preventDefault()
    },
    up: e => {
      if (this.millerStore.activeRow > 0) {
        this.millerKeyActions.up()
      }

      e.preventDefault()
    },
    esc: e => {
      // if (this.isTextbox(e)) return
      e.preventDefault()

      if (this.millerStore.activeAction) {
        this.millerStore.setActiveAction(null)
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
      const { currentItem, activeAction } = this.millerStore

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
