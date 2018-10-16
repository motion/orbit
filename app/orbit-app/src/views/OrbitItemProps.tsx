import { AppConfig } from '@mcro/stores'
import { OrbitItemStore } from './OrbitItemStore'
import { ItemHideProps } from '../types/ItemHideProps'
import { NormalizedItem, ItemResolverExtraProps } from '../components/ItemResolver'
import { ThemeObject, CSSPropertySet } from '@mcro/gloss'
import { SelectionStore } from '../pages/orbit/orbitDocked/SelectionStore'
import { PaneManagerStore } from '../pages/orbit/PaneManagerStore'
import { SubPaneStore } from '../pages/orbit/SubPaneStore'
import { ResolvableModel } from '../apps/types'

export type OrbitItemProps<T extends ResolvableModel> = CSSPropertySet &
  Partial<NormalizedItem> & {
    // whether to avoid model resolving and just use props
    direct?: boolean
    ignoreSelection?: boolean
    chromeless?: boolean
    theme?: Partial<ThemeObject>
    listItem?: boolean
    hoverToSelect?: boolean
    selectionStore?: SelectionStore
    paneManagerStore?: PaneManagerStore
    subPaneStore?: SubPaneStore
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
    children?: ((a: NormalizedItem, b: T, c: number) => React.ReactNode) | JSX.Element
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
    onClickLocation?: (item: NormalizedItem, e?: Event) => any
  }
