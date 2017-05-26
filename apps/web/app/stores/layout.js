// @flow
import { store } from '~/helpers'
import { Document } from '@jot/models'
import SidebarStore from './sidebar'

export default class LayoutStore {
  title = ''
  isDragging = false
  headerHovered = false
  creatingDoc = false
  sidebar = new SidebarStore()

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
