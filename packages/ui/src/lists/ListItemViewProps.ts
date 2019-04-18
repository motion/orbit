import { Bit } from '../helpers/BitLike'
import { NormalItem } from '../helpers/normalizeItem'
import { ItemRenderText, ListItemHide } from './ListItemSimple'

// TODO this can be merged better

export type ListItemViewProps = {
  item?: Bit
  normalizedItem?: Partial<NormalItem>
  shownLimit?: number
  searchTerm?: string
  renderText?: ItemRenderText
  hide?: ListItemHide
  beforeTitle?: React.ReactNode
  oneLine?: boolean
  preventSelect?: boolean
}
