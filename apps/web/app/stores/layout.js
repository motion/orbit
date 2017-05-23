import { Document } from '@jot/models'

export default class LayoutStore {
  title = ''
  isDragging = false
  headerHovered = false

  createDoc = () => {
    Document.create({ title: this.title, places: [App.activePlace] })
  }
}
