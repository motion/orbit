import { GenericBit } from '@mcro/models'
import { ItemRenderText, ListItemHide } from '@mcro/ui'
import { NormalItem } from './NormalItem'

export type OrbitItemViewProps<A> = {
  item?: GenericBit<A>
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
