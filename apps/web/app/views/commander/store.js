import { Document } from '@jot/models'
import { includes } from 'lodash'

const idFn = _ => _

export default class CommanderStore {
  isOpen = false
  docs = Document.recent()
  text = ''
  highlightIndex = 0

  get matches() {
    return (this.docs || []).filter(doc => {
      return includes(doc.getTitle().toLowerCase(), this.text.toLowerCase())
    })
  }

  get activeDoc() {
    return (this.docs || [])[this.highlightIndex] || null
  }

  moveHighlight = diff => {
    this.highlightIndex += diff

    if (this.highlightIndex === -1) this.highlightIndex = this.docs.length - 1
    if (this.highlightIndex >= this.docs.length) this.highlightIndex = 0
  }

  handleShortcuts = (action, event) => {
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
    this.isOpen = true
  }

  onClose = () => {
    this.setText('')
    this.isOpen = false
  }

  setText = value => {
    this.text = value
    this.highlightIndex = 0
    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }
}
