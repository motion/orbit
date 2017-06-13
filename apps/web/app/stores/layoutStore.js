// @flow
import { store } from '@jot/black'
import { User, Document } from '@jot/models'
import SidebarStore from '~/stores/sidebarStore'

export default class LayoutStore {
  title = ''
  isDragging = false
  headerHovered = false
  isCreatingDoc = false
  sidebar = new SidebarStore()

  onCreateDoc = () => {
    this.isCreatingDoc = true
  }

  onDraftClose = () => {
    this.isCreatingDoc = false
  }
}
