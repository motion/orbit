import { Document } from '@jot/models'
import { includes } from 'lodash'

export default class CommanderStore {
  focused = false
  open = false
  docs = Document.recent()
  textbox = null
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

  start() {}

  moveHighlight = diff => {
    this.highlightIndex += diff

    if (this.highlightIndex === -1) this.highlightIndex = this.docs.length - 1
    if (this.highlightIndex >= this.docs.length) this.highlightIndex = 0
  }

  navTo = doc => {
    this.onClose()
    Router.go(doc.url())
  }

  onClose = () => {
    this.setText('')
    this.open = false
  }

  onShortcut = (action, event) => {
    console.log('got', action)
    this.emit('key', action)

    // if (this.textbox.value.indexOf('/') === 0) {
    //   this.open = true
    // }

    // if (which === 40) this.moveHighlight(1)
    // if (which === 38) this.moveHighlight(-1)
    // if (which === 27) this.close()

    // if (which === 13) {
    //   if (this.match) this.navTo(this.math)
    //   else {
    //     this.props.onSubmit(this.text)
    //     this.setText('')
    //   }
    // }
  }

  setText = value => {
    this.text = value
    this.highlightIndex = 0
    this.open = true
    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }

  setFocused = () => {
    this.focused = true
  }

  setBlurred = () => {
    this.focused = false
  }
}
