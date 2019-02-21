import { GenericBit, IntegrationType } from '@mcro/models'
import { ItemRenderText, ListItemHide } from '@mcro/ui'
import { ItemType } from '../../types/ItemType'
import { NormalItem } from '../../types/NormalItem'

export type RichItemProps<A extends ItemType> = {
  item?: A extends IntegrationType ? GenericBit<A> : any
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
