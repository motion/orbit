import { ItemRenderText, ListItemHide, NormalItem } from '@o/ui'

export type RichItemProps = {
  item?: any
  normalizedItem?: Partial<NormalItem>
  shownLimit?: number
  searchTerm?: string
  renderText?: ItemRenderText
  hide?: ListItemHide
  beforeTitle?: React.ReactNode
  oneLine?: boolean
  preventSelect?: boolean
}
