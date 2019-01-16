import * as React from 'react'
import { FindOptions } from 'typeorm'
import { IntegrationType, Bit, PersonBit, Source, SearchResult, GenericBit } from '@mcro/models'
import { AppConfig } from '@mcro/models'
import { AppPageStore } from '../pages/AppPage/AppPageStore'
import { NormalItem } from '../helpers/normalizeItem'
import { SearchBarType } from '@mcro/ui'
import { GenericComponent } from '../types'
import { ListItemHide, ItemRenderText } from '../views/ListItems/ListItem'

type AppTypeToModelType = {
  slack: Bit
  github: Bit
  gmail: Bit
  jira: Bit
  confluence: Bit
  website: Bit
  drive: Bit
  person: PersonBit
  pinned: Bit
}

export type ItemType = IntegrationType | 'person'

type ModelFromType<A extends ItemType> = AppTypeToModelType[A]

export type OrbitItemViewProps<A extends ItemType> = {
  item?: A extends IntegrationType ? GenericBit<A> : any
  normalizedItem?: Partial<NormalItem>
  isExpanded?: boolean
  shownLimit?: number
  searchTerm?: string
  renderText?: ItemRenderText
  hide?: ListItemHide
  extraProps?: {
    beforeTitle?: React.ReactNode
    oneLine?: boolean
    condensed?: boolean
    preventSelect?: boolean
  }
}

export type OrbitSourceMainProps<A extends ItemType> = OrbitItemViewProps<A> & {
  appPageStore: AppPageStore
  searchBar: SearchBarType
  searchTerm: string
}

export type OrbitSourceSettingProps<T extends Source> = {
  appConfig: AppConfig
  source: T
  appPageStore: AppPageStore
}

export type OrbitIntegration<A extends ItemType> = {
  source?: Source
  display?: {
    name: string
    itemName?: string
    icon?: string
    iconLight?: string
  }
  modelType: ModelFromType<A>['target']
  integration?: A
  appName?: string
  defaultQuery?: any | FindOptions<ModelFromType<A>> // TODO umed
  viewConfig?: AppConfig['viewConfig']
  views: {
    main: GenericComponent<OrbitSourceMainProps<A>>
    item: GenericComponent<OrbitItemViewProps<A>>
    setting?: GenericComponent<OrbitSourceSettingProps<Source>>
    setup?: GenericComponent<any>
  }
}

export type OrbitIntegrations = { [key in ItemType]: OrbitIntegration<ItemType> }

export type GetOrbitIntegration<A extends ItemType> = (source: Source) => OrbitIntegration<A>

export type GetOrbitIntegrations = { [key in ItemType]: GetOrbitIntegration<ItemType> }

export type ResolvableModel = Bit | PersonBit | Source | SearchResult
