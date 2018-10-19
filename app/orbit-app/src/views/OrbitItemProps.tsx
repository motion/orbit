import { AppConfig } from '@mcro/stores'
import { OrbitItemStore } from './OrbitItemStore'
import { NormalizedItem } from '../helpers/normalizeItem'
import { ThemeObject } from '@mcro/gloss'
import { ResolvableModel, AppProps } from '../apps/types'
import { SelectionStore } from '../pages/OrbitPage/orbitDocked/SelectionStore'
import { PaneManagerStore } from '../pages/OrbitPage/PaneManagerStore'
import { SubPaneStore } from '../pages/OrbitPage/SubPaneStore'
import { AppsStore } from '../stores/AppsStore'
import { CSSPropertySetStrict } from '../../../../packages/css/_/cssPropertySet'

export type OrbitItemProps<T extends ResolvableModel> = CSSPropertySetStrict &
  Partial<NormalizedItem> & {
    // whether to avoid model resolving and just use props
    activeCondition?: () => boolean
    direct?: boolean
    ignoreSelection?: boolean
    chromeless?: boolean
    theme?: Partial<ThemeObject>
    listItem?: boolean
    hoverToSelect?: boolean
    appsStore?: AppsStore
    selectionStore?: SelectionStore
    paneManagerStore?: PaneManagerStore
    subPaneStore?: SubPaneStore
    subtitle?: React.ReactNode
    date?: React.ReactNode
    icon?: React.ReactNode
    appConfig?: AppConfig
    index?: number
    store?: OrbitItemStore
    isExpanded?: boolean
    style?: Object
    afterTitle?: React.ReactNode
    titleProps?: Object
    inactive?: boolean
    iconProps?: Object
    hide?: AppProps<any>['hide']
    extraProps?: Partial<AppProps<any>['extraProps']>
    className?: string
    inGrid?: boolean
    pane?: string
    subPane?: string
    model?: T
    children?:
      | ((normalizedItem: NormalizedItem, model?: T, index?: number) => JSX.Element)
      | JSX.Element
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
