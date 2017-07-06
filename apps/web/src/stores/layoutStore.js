// @flow
import SidebarStore from '~/stores/sidebarStore'

export default class LayoutStore {
  title = ''
  isDragging = false
  isCreatingDoc = false
  sidebar = new SidebarStore()
}
