import { Component } from 'react'
import { FindOptions } from 'typeorm'
import { IntegrationType, Bit, PersonBit, Setting, GenericBit } from '@mcro/models'
import { AppConfig } from '@mcro/stores'
import { AppStore } from '../pages/AppPage/AppStore'
import { NormalizedItem } from '../helpers/normalizeItem'
import { SearchBarType } from '@mcro/ui'
import { AppInfoStore } from '../stores/AppInfoStore'

type AppTypeToModelType = {
  slack: Bit
  github: Bit
  gmail: Bit
  jira: Bit
  confluence: Bit
  website: Bit
  drive: Bit
  person: PersonBit
  apps: Setting
}

export type AppType = IntegrationType | 'person'

type ModelFromType<A extends AppType> = AppTypeToModelType[A]

export type AppProps<T extends ResolvableModel> = {
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
export type OrbitGenericAppProps<A extends AppType> = AppProps<ModelFromType<A>>

// for just "bit" apps
// much more common / external facing
// so give it the nicer name
export type OrbitAppProps<A extends AppType> = AppProps<ModelFromType<A>> & {
  bit: GenericBit<any>
  normalizedItem: NormalizedItem
}

export type OrbitAppMainProps<A extends AppType> = OrbitAppProps<A> & {
  appStore: AppStore
  searchBar: SearchBarType
  searchTerm: string
}

export type OrbitAppSettingProps<T extends Setting> = {
  appConfig: AppConfig
  appInfoStore: AppInfoStore
  setting: T
  appStore: AppStore
}

export type OrbitApp<A extends AppType> = {
  setting?: Setting
  display?: {
    name: string
    itemName?: string
    icon?: string
    iconLight?: string
  }
  source: ModelFromType<A>['target']
  integration?: A
  appName?: string
  defaultQuery?: any | FindOptions<ModelFromType<A>> // TODO umed
  viewConfig?: AppConfig['viewConfig']
  views: {
    main: Component<OrbitAppMainProps<A>, any, any>
    item: Component<OrbitAppProps<A>, any, any>
    setting?: Component<OrbitAppProps<A>, any, any>
    setup?: Component<any>
  }
}

export type OrbitApps = { [key in AppType]: OrbitApp<AppType> }

export type GetOrbitApp<A extends AppType> = (setting: Setting) => OrbitApp<A>

export type GetOrbitApps = { [key in AppType]: GetOrbitApp<AppType> }

export type ResolvableModel = Bit | PersonBit | Setting
