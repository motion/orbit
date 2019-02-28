import { ItemRenderText, ListItemHide } from '@mcro/ui'
import { NormalItem } from './NormalItem'
import { Bit } from '@mcro/models'

export type OrbitItemViewProps = {
  item?: Bit
  normalizedItem?: Partial<NormalItem>
  isExpanded?: boolean
  shownLimit?: number
  searchTerm?: string
  renderText?: ItemRenderText
  hide?: ListItemHide
  beforeTitle?: React.ReactNode
  oneLine?: boolean
  condensed?: boolean
  preventSelect?: boolean
}
