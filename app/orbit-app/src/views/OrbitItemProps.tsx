import { AppConfig } from '@mcro/stores'
import { PaneManagerStore } from '../apps/orbit/PaneManagerStore'
import { Bit, Setting, PersonBit } from '@mcro/models'
import { SelectionStore } from '../apps/orbit/orbitDocked/SelectionStore'
import { SubPaneStore } from '../apps/orbit/SubPaneStore'
import { OrbitItemStore } from './OrbitItemStore'
import { ItemHideProps } from '../types/ItemHideProps'
import { ResolvedItem, ItemResolverExtraProps } from '../components/ItemResolver'
import { ThemeObject, CSSPropertySet } from '@mcro/gloss'

type Model = Bit | PersonBit | Setting

export type OrbitItemProps<T extends Model> = CSSPropertySet & {
  theme?: Partial<ThemeObject>
  listItem?: boolean
  hoverToSelect?: boolean
  selectionStore?: SelectionStore
  paneManagerStore?: PaneManagerStore
  subPaneStore?: SubPaneStore
  title?: React.ReactNode
  subtitle?: React.ReactNode
  date?: React.ReactNode
  icon?: React.ReactNode
  result?: AppConfig
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
  model?: T
  extraProps?: Partial<ItemResolverExtraProps>
  children?:
    | ((a: ResolvedItem, b: Bit | PersonBit | Setting, c: number) => JSX.Element)
    | React.ReactNode
  onClick?: Function
  onSelect?: (a: HTMLElement) => any
  borderRadius?: number
  nextUpStyle?: Object
  isSelected?: boolean | Function
  cardProps?: Object
  disableShadow?: boolean
  preventAutoSelect?: boolean
  padding?: number | number[]
  titleFlex?: number
  subtitleProps?: Object
  getIndex?: (id: T) => number
  subtitleSpaceBetween?: React.ReactNode
  searchTerm?: string
  onClickLocation?: (e: Event, item: ResolvedItem) => any
}
