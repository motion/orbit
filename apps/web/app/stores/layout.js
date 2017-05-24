import { Document } from '@jot/models'

export default class LayoutStore {
  title = ''
  isDragging = false
  headerHovered = false
  creatingDoc = false

  createDoc = async props => {
    const params = {
      draft: true,
      places: [App.activePage.place._id],
      ...props,
    }

    const doc = await Document.create(params)
    this.creatingDoc = doc
  }
}
