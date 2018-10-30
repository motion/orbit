import * as React from 'react'
import { FindOptions } from 'typeorm'
import { IntegrationType, Bit, PersonBit, Source, GenericBit } from '@mcro/models'
import { AppConfig } from '@mcro/stores'
import { AppStore } from '../pages/AppPage/AppStore'
import { NormalizedItem } from '../helpers/normalizeItem'
import { SearchBarType } from '@mcro/ui'
import { AppInfoStore } from '../components/AppInfoStore'

type AppTypeToModelType = {
  slack: Bit
  github: Bit
  gmail: Bit
  jira: Bit
  confluence: Bit
  website: Bit
  drive: Bit
  person: PersonBit
}

export type ItemType = IntegrationType | 'person'

type ModelFromType<A extends ItemType> = AppTypeToModelType[A]

export type OrbitItemProps<T extends ResolvableModel> = {
  model?: T
  isExpanded?: boolean
  shownLimit?: number
  searchTerm?: string
  hide?: {
    people?: boolean
    title?: boolean
    icon?: boolean
    subtitle?: boolean
    body?: boolean
    itemDate?: boolean
    date?: boolean
    meta?: boolean
  }
  extraProps?: {
    beforeTitle?: React.ReactNode
    minimal?: boolean
    preventSelect?: boolean
  }
}

// for all apps, including non-bit apps
export type OrbitGenericSourceProps<A extends ItemType> = OrbitItemProps<ModelFromType<A>>

// for just "bit" apps
// much more common / external facing
// so give it the nicer name
export type OrbitIntegrationProps<A extends ItemType> = OrbitItemProps<ModelFromType<A>> & {
  bit: GenericBit<any>
  normalizedItem: NormalizedItem
}

export type OrbitSourceMainProps<A extends ItemType> = OrbitIntegrationProps<A> & {
  appStore: AppStore
  searchBar: SearchBarType
  searchTerm: string
}

export type OrbitSourceSettingProps<T extends Source> = {
  appConfig: AppConfig
  appInfoStore: AppInfoStore
  source: T
  appStore: AppStore
}

type GenericComponent<T> = React.ComponentClass<T> | React.SFC<T>

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
    item: GenericComponent<OrbitIntegrationProps<A>>
    source?: GenericComponent<OrbitSourceSettingProps<Source>>
    setup?: GenericComponent<any>
  }
}

export type OrbitIntegrations = { [key in ItemType]: OrbitIntegration<ItemType> }

export type GetOrbitIntegration<A extends ItemType> = (source: Source) => OrbitIntegration<A>

export type GetOrbitIntegrations = { [key in ItemType]: GetOrbitIntegration<ItemType> }

export type ResolvableModel = Bit | PersonBit | Source
