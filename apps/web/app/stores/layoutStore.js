// @flow
import SidebarStore from '~/stores/sidebarStore'
import { watch } from '@jot/black'
import { User } from '@jot/models'

export default class LayoutStore {
  title = ''
  isDragging = false
  headerHovered = false
  isCreatingDoc = false
  sidebar = new SidebarStore()
  showOnboard = false //watch(() => !User.org)
}
