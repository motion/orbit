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
      () => this.editor.contentState,
      () => {
        this.pendingSave = true
      }
    )

    // init content
    this.watch(() => {
      if (!this.editor.state) {
        this.editor.setContents(this.document.content, true)
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
      () => [this.editor.contentState, this.pendingSave],
      () => {
        if (this.canSave) {
          this.save()
        }
      }
    )
  }

  save = () => {
    const nextState = this.editor.serializedState
    this.document.content = nextState
    this.document.title = nextState.document.nodes.first().text
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
    console.log(
      'canSave',
      this.lastSavedRev,
      this.document._rev,
      this.editor.focused,
      this.hasUploadingImages
    )
    if (!this.editor.contentState) {
      return false
    }
    if (this.lastSavedRev === this.document._rev) {
      return false
    }
    // for now, prevent saving when not focused
    // avoid tons of saves on inline docs
    if (!this.editor.focused) {
      return false
    }
    if (this.hasUploadingImages) {
      return false
    }
    return true
  }
}
