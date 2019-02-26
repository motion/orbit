import { Space } from './Space'

// base

export interface AppBit {
  target: 'app'
  id?: number
  appId: string
  space?: Space
  spaceId?: number
  name?: string
  pinned?: boolean
  colors?: string[]
  editable?: boolean
  data?: any
}
