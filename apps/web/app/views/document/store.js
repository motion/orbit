// @flow
import { Document } from '@jot/models'
import { debug } from '~/helpers'

const print = debug('documentStore')

export default class DocumentStore {
  id = this.props.id
  inline = this.props.inline || false
  document = Document.get(this.props.id)
  lastSavedRev = null
  lastSavedState = null
  shouldFocus = this.props.focusOnMount
  editor = null
  downAt = Date.now()

  get hasNewContent() {
    return (
      !this.lastSavedState ||
      !this.lastSavedState.equals(this.editor.contentState)
    )
  }

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

    // save
    this.react(
      () => [this.editor.contentState, this.hasNewContent, this.document._rev],
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
    print('saving...', this.document._id, this.document._rev, this.document)
    this.document.save()
  }

  get canSave() {
    if (!this.editor.contentState) {
      print('no, no content...')
      return false
    }
    if (!this.hasNewContent) {
      print('no, no new content...')
      return false
    }
    if (this.lastSavedRev === this.document._rev) {
      print('no, old rev...')
      return false
    }
    // for now, prevent saving when not focused
    // avoid tons of saves on inline docs
    // if (!this.editor.focused) {
    //   print('no, not focused...')
    //   return false
    // }
    if (this.hasUploadingImages) {
      print('no, uploading images...')
      return false
    }
    return true
  }
}
