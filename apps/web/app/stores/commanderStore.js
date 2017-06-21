import { Document } from '@jot/models'
import { debounce } from 'lodash'
import Router from '~/router'

const idFn = _ => _
const OPEN = 'commander_is_open'

const bool = s => s === 'true'

export default class CommanderStore {
  isOpen = bool(localStorage.getItem(OPEN)) || false
  text = ''
  textboxText = ''
  highlightIndex = 0
  searchIds = []
  docs = []

  get activeDoc() {
    return (this.docs || [])[this.highlightIndex] || null
  }

  setOpen = val => {
    localStorage.setItem(OPEN, val)
    this.isOpen = val
  }

  moveHighlight = diff => {
    this.highlightIndex += diff

    if (this.highlightIndex === -1) this.highlightIndex = this.docs.length - 1
    if (this.highlightIndex >= this.docs.length) this.highlightIndex = 0
  }

  handleShortcuts = action => {
    const actions = {
      up: () => this.moveHighlight(-1),
      down: () => this.moveHighlight(1),
      esc: () => this.onClose(),
      enter: () => this.navTo(this.activeDoc),
    }
    ;(actions[action] || idFn)()
  }

  navTo = doc => {
    this.onClose()
    Router.go(doc.url())
  }

  onOpen = () => {
    this.setText('')
    this.setOpen(true)
  }

  onClose = () => {
    // isOpen being false calls portal close, which calls this
    // this line prevents the function running twice
    if (!this.isOpen) return
    this.setText('')
    this.setOpen(false)
  }

  commitText = debounce(
    async val => {
      this.text = val
      this.highlightIndex = 0
      this.docs = await Document.search(this.text)
      console.log('ids are', this.searchIds)
    },
    150,
    true
  )

  setText = value => {
    this.textboxText = value
    this.commitText(value)
  }
}
