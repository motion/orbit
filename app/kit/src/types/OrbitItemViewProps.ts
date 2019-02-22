import { GenericBit, SourceType } from '@mcro/models'
import { ItemRenderText, ListItemHide } from '@mcro/ui'
import { ItemType } from './ItemType'
import { NormalItem } from './NormalItem'

export type OrbitItemViewProps<A extends ItemType> = {
  item?: A extends SourceType ? GenericBit<A> : any
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
