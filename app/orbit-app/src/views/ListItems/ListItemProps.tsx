import { NormalItem } from '../../helpers/normalizeItem'
import { ThemeObject } from '@mcro/gloss'
import { GenericItemProps } from '../../sources/types'
import { CSSPropertySetStrict } from '@mcro/css'
import { AppConfig } from '@mcro/models'

export type ItemRenderText = ((text: string) => JSX.Element)

export type HandleSelection = (index?: number, config?: AppConfig, element?: HTMLElement) => any

export type ListItemProps<T extends any> = CSSPropertySetStrict &
  Partial<NormalItem> & {
    // for setting the view
    appConfig?: AppConfig

    // whether to avoid model resolving and just use props
    activeStyle?: Object
    before?: React.ReactNode
    ignoreSelection?: boolean
    chromeless?: boolean
    theme?: Partial<ThemeObject>
    listItem?: boolean
    hoverToSelect?: boolean
    subtitle?: React.ReactNode
    date?: React.ReactNode
    icon?: React.ReactNode
    index?: number
    isExpanded?: boolean
    style?: any
    afterTitle?: React.ReactNode
    after?: React.ReactNode
    titleProps?: Object
    iconProps?: Object
    hide?: GenericItemProps<any>['hide']
    extraProps?: Partial<GenericItemProps<any>['extraProps']>
    className?: string
    inGrid?: boolean
    pane?: string
    subPane?: string
    item?: T
    renderText?: ItemRenderText
    children?: React.ReactNode
    onClick?: Function
    // single click / keyboard select
    onSelect?: HandleSelection
    // double click / keyboard enter
    onOpen?: HandleSelection
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
    onClickLocation?: (item: NormalItem, e?: Event) => any
    separator?: React.ReactNode
    group?: string
  }
