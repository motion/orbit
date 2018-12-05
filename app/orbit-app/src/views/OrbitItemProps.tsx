import { AppConfig } from '@mcro/stores'
import { OrbitItemStore } from './OrbitItemStore'
import { NormalizedItem } from '../helpers/normalizeItem'
import { ThemeObject } from '@mcro/gloss'
import { ResolvableModel, GenericItemProps } from '../sources/types'
import { SourcesStore } from '../stores/SourcesStore'
import { AppStore } from '../apps/AppStore'
import { CSSPropertySetStrict } from '@mcro/css'
import { AppType } from '@mcro/models'

export type ItemRenderText = ((text: string) => JSX.Element)

export type OrbitItemProps<T extends ResolvableModel> = CSSPropertySetStrict &
  Partial<NormalizedItem> & {
    // for setting the view
    appType?: AppType
    appConfig?: AppConfig

    // whether to avoid model resolving and just use props
    activeStyle?: Object
    activeCondition?: () => boolean
    before?: React.ReactNode
    direct?: boolean
    ignoreSelection?: boolean
    chromeless?: boolean
    theme?: Partial<ThemeObject>
    listItem?: boolean
    hoverToSelect?: boolean
    sourcesStore?: SourcesStore
    appStore?: AppStore
    subtitle?: React.ReactNode
    date?: React.ReactNode
    icon?: React.ReactNode
    index?: number
    store?: OrbitItemStore
    isExpanded?: boolean
    style?: any
    afterTitle?: React.ReactNode
    after?: React.ReactNode
    titleProps?: Object
    inactive?: boolean
    iconProps?: Object
    hide?: GenericItemProps<any>['hide']
    extraProps?: Partial<GenericItemProps<any>['extraProps']>
    className?: string
    inGrid?: boolean
    pane?: string
    subPane?: string
    model?: T
    renderText?: ItemRenderText
    children?: React.ReactNode
    onClick?: Function
    onSelect?: (index?: number, config?: AppConfig, element?: HTMLElement) => any
    borderRadius?: number
    nextUpStyle?: Object
    isSelected?: boolean | Function
    cardProps?: Object
    disableShadow?: boolean
    padding?: number | number[]
    titleFlex?: number
    subtitleProps?: Object
    getIndex?: (id: T) => number
    subtitleSpaceBetween?: React.ReactNode
    searchTerm?: string
    onClickLocation?: (item: NormalizedItem, e?: Event) => any
    separator?: React.ReactNode
  }
