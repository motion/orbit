import { AppConfig } from '@mcro/stores'
import { PaneManagerStore } from '../apps/orbit/PaneManagerStore'
import { Bit, Setting } from '@mcro/models'
import { SelectionStore } from '../stores/SelectionStore'
import { AppStore } from '../stores/AppStore'
import { SubPaneStore } from '../apps/orbit/SubPaneStore'
import { OrbitItemStore } from './OrbitItemStore'
import { ItemHideProps } from '../types/ItemHideProps'
import { ResolvedItem } from '../components/ItemResolver'
import { PersonBit } from '../../../models/src'
import { ThemeObject } from '@mcro/gloss'

type Model = Bit | PersonBit | Setting

export type OrbitItemProps = {
  theme?: Partial<ThemeObject>
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
  model?: Model
  itemProps?: Object
  children?:
    | ((a: ResolvedItem, b: Bit, c: number) => JSX.Element)
    | React.ReactNode
  onClick?: Function
  onSelect?: (a: HTMLElement) => any
  borderRadius?: number
  nextUpStyle?: Object
  isSelected?: boolean | Function
  cardProps?: Object
  item?: AppConfig
  disableShadow?: boolean
  preventAutoSelect?: boolean
  padding?: number | number[]
  titleFlex?: number
  subtitleProps?: Object
  getIndex?: (id: Model) => number
  subtitleSpaceBetween?: React.ReactNode
  searchTerm?: string
  onClickLocation?: (e: Event, item: ResolvedItem) => any
}
