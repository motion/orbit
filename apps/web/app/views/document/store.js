// @flow
import { Document } from '@jot/models'

export default class DocumentStore {
  id = this.props.id
  inline = this.props.inline || false
  document = Document.get(this.props.id)
  lastSavedRev = null
  shouldFocus = this.props.focusOnMount
  pendingSave = false
  editor = null
  downAt = Date.now()

  mousedown = () => {
    this.downAt = Date.now()
  }

  mouseup = (event: MouseEvent) => {
    const isDirectClick = event.target === event.currentTarget
    const isShortClick = Date.now() - this.downAt < 200
    if (isDirectClick && isShortClick) {
      this.editor.focus()
    }
  }

  onEditor = editor => {
    if (!editor) return
    this.editor = editor

    // pending save management
    this.react(
      () => this.editor.state,
      () => {
        this.pendingSave = true
      }
    )

    // init content
    this.watch(() => {
      if (this.document && !this.editor.state) {
        this.editor.setState(this.document.content, true)
      }
    })

    if (!this.inline) {
      this.on(this.props.commanderStore, 'key', name => {
        if (name === 'down') {
          this.editor.focus()
        }
      })
    }

    // this forces it to save on doc update
    this.react(
      () => this.document && this.document._rev,
      rev => {
        if (this.pendingSave === true) {
          console.log('clear pending', rev)
          this.pendingSave = false
        }
      }
    )

    // save
    this.react(
      () => [this.editor.state, this.pendingSave],
      () => {
        if (this.canSave) {
          this.save()
        }
      }
    )
  }

  save = () => {
    this.document.content = Raw.serialize(this.editor.state)
    this.document.title = this.editor.state.document.nodes.first().text
    console.log(
      'saving...',
      this.document._id,
      this.document._rev,
      this.document.title
    )
    this.document.save()
    this.lastSavedRev = this.document._rev
    this.pendingSave = false
  }

  get canSave() {
    if (!this.editor.state) {
      return false
    }
    if (this.lastSavedRev === this.document._rev) {
      return false
    }
    // for now, prevent saving when not focused
    // avoid tons of saves on inline docs
    if (!this.focused) {
      return false
    }
    if (this.hasUploadingImages) {
      return false
    }
    return true
  }
}
