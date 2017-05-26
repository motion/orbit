// @flow
import { Document } from '@jot/models'

export default class DocumentStore {
  id = this.props.id
  inline = this.props.inline || false
  document = Document.get(this.props.id)
  lastSavedRev = null
  lastSavedState = null
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
        console.log('new rev', rev, 'pendingSave?', this.pendingSave)
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
    this.lastSavedRev = this.document._rev
    this.lastSavedState = this.editor.contentState
    this.document.content = this.editor.serializedState
    this.document.title = this.editor.state.document.nodes.first().text
    console.log(
      'saving...',
      this.document._id,
      this.document._rev,
      this.document
    )
    this.document.save()
    this.pendingSave = false
  }

  get canSave() {
    console.log('canSave')
    if (!this.editor.contentState) {
      console.log('no, no content...')
      return false
    }
    if (
      this.lastSavedState &&
      this.lastSavedState.equals(this.editor.contentState)
    ) {
      console.log('no, old content...')
      return false
    }
    if (this.lastSavedRev === this.document._rev) {
      console.log('no, old rev...')
      return false
    }
    // for now, prevent saving when not focused
    // avoid tons of saves on inline docs
    if (!this.editor.focused) {
      console.log('no, not focused...')
      return false
    }
    if (this.hasUploadingImages) {
      console.log('no, uploading images...')
      return false
    }
    return true
  }
}
