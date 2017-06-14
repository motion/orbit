import { watch } from '@jot/black'
import { Document } from '@jot/models'

export default class DocListStore {
  get doc() {
    if (!this.props.docStore) {
      return false
    }
    return this.props.docStore.doc
  }

  // checking for inline prevents infinite recursion!
  //  <Editor inline /> === showing inside a document
  docs = watch(
    () => !this.props.inline && Document.child(this.doc && this.doc._id)
  )
  shouldFocus = false

  createDoc = async () => {
    if (!this.props.docStore) {
      await Document.create()
    } else {
      await Document.create({ docs: [this.props.docStore.doc._id] })
    }
    this.setTimeout(() => {
      this.shouldFocus = true
    }, 200)
  }

  setType = (node, listType: string) => {
    const next = node.data.set('listType', listType)
    this.props.setData(next)
  }

  doneFocusing = () => {
    this.shouldFocus = false
  }
}
