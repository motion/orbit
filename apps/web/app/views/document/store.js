import { Document } from 'models'
import { observable, computed } from 'mobx'

export default class DocumentStore {
  start(id) {
    this.docs = Document.get(id)
  }

  editorRef = null

  get doc() {
    return this.docs && this.docs.current
  }

  @observable editingTitle = false
  @observable newTitle = ''

  @computed get title() {
    return this.editingTitle ? this.newTitle : this.doc.title
  }

  editTitle = () => {
    this.newTitle = this.doc.title
    this.editingTitle = true
  }

  saveTitle = () => {
    this.doc.title = this.newTitle
    this.doc.save()
    this.editingTitle = false
  }

  focusEditor = () => {
    this.editorRef.focus()
  }

  toggleCollab = () => {}
}
