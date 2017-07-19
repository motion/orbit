// @flow
import { watch } from '@mcro/black'
import { debug } from '~/helpers'
import { Document } from '@mcro/models'
import type EditorStore from '~/editor/stores/editorStore'
import { debounce } from 'lodash'

const print = debug('documentStore')

type Props = {
  id?: string,
  document?: Document,
  inline?: boolean,
}

export default class DocumentStore {
  props: Props

  id = this.props.id
  @watch
  document: ?Document = () => this.props.document || Document.get(this.props.id)
  lastSavedRev: ?string = null
  lastSavedState = null
  editor: ?EditorStore = null
  downAt = Date.now()

  get hasNewContent(): boolean {
    return (
      !this.lastSavedState ||
      !this.lastSavedState.equals(this.editor && this.editor.contentState)
    )
  }

  mousedown = () => {
    this.downAt = Date.now()
  }

  mouseup = (event: MouseEvent) => {
    const isDirectClick = event.target === event.currentTarget
    const isShortClick = Date.now() - this.downAt < 200
    if (isDirectClick && isShortClick && this.editor) {
      this.editor.focus()
    }
  }

  onEditor = (editor: EditorStore) => {
    if (!editor) {
      console.log('no editor given')
      return
    }

    this.editor = editor

    // init content
    this.watch(() => {
      if (!this.editor.state) {
        this.editor.setContents(this.document.content, true)
      }
    })

    // save
    this.react(
      () => [
        this.editor.contentState,
        this.hasNewContent,
        this.document && this.document._rev,
      ],
      () => {
        if (this.canSave) {
          this.save()
        }
      }
    )
  }

  // you'll want this to be false if setting from other places (e.g. sidebar)
  save = debounce((setContentFromEditor = true) => {
    this.lastSavedRev = this.document._rev
    this.lastSavedState = this.editor.contentState
    if (setContentFromEditor) {
      this.document.content = this.editor.serializedState
    }
    this.document.text = this.editor.serializedText
    this.document.title = this.editor.state.document.nodes.first().text
    print('saving...', this.document._id, this.document._rev, this.document)
    this.document.save()
    console.log('saved doc')
  }, 300)

  get canSave() {
    if (!this.document) {
      return false
    }
    if (this.props.readOnly) {
      return false
    }
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
    if (!this.editor.focused) {
      print('no, not focused...')
      return false
    }
    if (this.hasUploadingImages) {
      print('no, uploading images...')
      return false
    }
    return true
  }
}
