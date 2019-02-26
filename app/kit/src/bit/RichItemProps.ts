import { ItemRenderText, ListItemHide } from '@mcro/ui'
import { NormalItem } from '../types/NormalItem'

export type RichItemProps = {
  item?: any
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
