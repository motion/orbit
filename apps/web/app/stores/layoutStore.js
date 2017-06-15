// @flow
import { store } from '@jot/black'
import { Document } from '@jot/models'
import SidebarStore from '~/stores/sidebarStore'

export default class LayoutStore {
  title = ''
  isDragging = false
  headerHovered = false
  creatingDoc = false
  sidebar = new SidebarStore()
  isCreatingDoc = false
}
