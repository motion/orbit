import { watch } from '@mcro/black'
import { Document } from '@mcro/models'

export default class DocListStore {
  get document() {
    return this.props.docStore && this.props.docStore.document
  }

  // checking for inline prevents infinite recursion!
  //  <Editor inline /> === showing inside a document
  @watch
  docs = () =>
    !this.props.inline && Document.child(this.document && this.document._id)
  shouldFocus = false

  createDoc = async () => {
    if (!this.document) {
      await Document.create()
    } else {
      await Document.create({ parentId: this.document._id })
    }

    this.setTimeout(() => {
      this.shouldFocus = true
    }, 50)
  }

  setType = (node, listType: string) => {
    const next = node.data.set('listType', listType)
    this.props.setData(next)
  }

  doneFocusing = () => {
    this.shouldFocus = false
  }
}
