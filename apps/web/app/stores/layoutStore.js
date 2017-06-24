// @flow
import SidebarStore from '~/stores/sidebarStore'

export default class LayoutStore {
  title = ''
  isDragging = false
  headerHovered = false
  isCreatingDoc = false
  isCommanderOpen = false
  sidebar = new SidebarStore()
}
