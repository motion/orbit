import { watch } from '@jot/black'
import { Document } from '@jot/models'

export default class DocListStore {
  get place() {
    if (!this.props.placeStore) {
      return false
    }
    return this.props.placeStore.place
  }

  // checking for inline prevents infinite recursion!
  //  <Editor inline /> === showing inside a document
  docs = watch(
    () => !this.props.inline && Document.forPlace(this.place && this.place._id)
  )
  shouldFocus = false

  createDoc = async () => {
    if (!this.props.placeStore) {
      await Document.create()
    } else {
      await Document.create({ places: [this.props.placeStore.place._id] })
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
