import { ItemType } from './ItemType'
import { Space } from './Space'

export interface AppBit {
  target: 'app'

  id?: number

  itemType?: ItemType

  identifier?: string

  // For validating if we're re-adding the same source
  sourceIdentifier?: string

  space?: Space

  spaceId?: number

  /**
   * Spaces where app is stored.
   */
  spaces?: Space[]

  name?: string

  pinned?: boolean

  colors?: string[]

  editable?: boolean

  createdAt?: Date

  updatedAt?: Date

  token?: string

  data?: any

}
