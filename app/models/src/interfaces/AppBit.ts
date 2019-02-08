import { Space } from './Space'

// base

export interface AppBit {
  target: 'app'
  id?: number
  space?: Space
  spaceId?: number
  name?: string
  type?: string
  pinned?: boolean
  colors?: string[]
  editable?: boolean
  data?: any
}
