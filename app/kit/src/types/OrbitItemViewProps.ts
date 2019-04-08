import { Bit } from '@o/models'
import { ItemRenderText, ListItemHide } from '@o/ui'
import { NormalItem } from './NormalItem'

export type OrbitItemViewProps = {
  item?: Bit
  normalizedItem?: Partial<NormalItem>
  shownLimit?: number
  searchTerm?: string
  renderText?: ItemRenderText
  hide?: ListItemHide
  beforeTitle?: React.ReactNode
  oneLine?: boolean
  condensed?: boolean
  preventSelect?: boolean
}
