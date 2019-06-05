import { ItemType } from './ItemType'
import { Space } from './SpaceInterface'

export interface AppBit<Data = any> {
  target: 'app'

  id?: number

  itemType?: ItemType

  identifier?: string

  space?: Space

  spaceId?: number

  /**
   * Spaces where app is stored.
   */
  spaces?: Space[]

  name?: string

  /**
   * permament = fixed to the front of the pinned tabs
   * pinned = smaller, sorts to the front
   * plain = shows as normal tab
   * hidden = not used in main navigation, system/orbit-level tabs
   */
  tabDisplay?: 'permanent' | 'pinned' | 'plain' | 'hidden'

  colors?: string[]

  createdAt?: Date

  updatedAt?: Date

  token?: string

  data?: Data
}
