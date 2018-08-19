import { AppStatePeekItem } from '@mcro/stores'
import { PaneManagerStore } from '../apps/orbit/PaneManagerStore'
import { Bit } from '@mcro/models'
import { SelectionStore } from '../stores/SelectionStore'
import { AppStore } from '../stores/AppStore'
import { SubPaneStore } from '../apps/orbit/SubPaneStore'
import { OrbitItemStore } from './OrbitItemStore'
import { ItemHideProps } from '../types/ItemHideProps'

export type OrbitItemProps = {
  listItem?: boolean
  hoverToSelect?: boolean
  appStore?: AppStore
  selectionStore?: SelectionStore
  paneManagerStore?: PaneManagerStore
  subPaneStore?: SubPaneStore
  title?: React.ReactNode
  subtitle?: React.ReactNode
  date?: React.ReactNode
  icon?: React.ReactNode
  result?: AppStatePeekItem & {
    auth: boolean
  }
  index?: number
  store?: OrbitItemStore
  isExpanded?: boolean
  style?: Object
  afterTitle?: React.ReactNode
  titleProps?: Object
  inactive?: boolean
  iconProps?: Object
  hide?: ItemHideProps
  className?: string
  inGrid?: boolean
  pane?: string
  subPane?: string
  bit?: Bit
  itemProps?: Object
  children?: ((a: Object, b: Bit, c: number) => JSX.Element) | React.ReactNode
  onClick?: Function
  onSelect?: (a: HTMLElement) => any
  borderRadius?: number
  nextUpStyle?: Object
  isSelected?: boolean | Function
  cardProps?: Object
  item?: AppStatePeekItem
  disableShadow?: boolean
  preventAutoSelect?: boolean
  padding?: number | number[]
  titleFlex?: number
  subtitleProps?: Object
  getIndex?: (id: string) => number
  subtitleSpaceBetween?: React.ReactNode
  searchTerm?: string
}
