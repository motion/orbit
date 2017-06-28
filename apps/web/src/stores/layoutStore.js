// @flow
import SidebarStore from '~/stores/sidebarStore'
import { watch } from '@mcro/black'
import { User } from '@mcro/models'

export default class LayoutStore {
  title = ''
  isDragging = false
  headerHovered = false
  isCreatingDoc = false
  sidebar = new SidebarStore()
  showOnboard = false //watch(() => !User.org)
}
