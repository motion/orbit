// @flow
import { store } from '~/helpers'
import { Document } from '@jot/models'
import SidebarStore from './sidebar'

export default class LayoutStore {
  title = ''
  isDragging = false
  headerHovered = false
  sidebar = new SidebarStore()
}
