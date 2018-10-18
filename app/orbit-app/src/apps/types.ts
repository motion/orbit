import { Component } from 'react'
import { FindOptions } from 'typeorm'
import {
  IntegrationSetting,
  IntegrationType,
  Bit,
  PersonBit,
  Setting,
  GenericBit,
} from '@mcro/models'
import { AppConfig } from '@mcro/stores'
import { AppStore } from '../pages/AppPage/AppStore'
import { NormalizedItem } from '../components/ItemResolver'
import { SearchBarType } from '@mcro/ui'
import { AppInfoStore } from '../stores/AppInfoStore'

type AppTypeToModelType = {
  slack: Bit
  github: Bit
  gmail: Bit
  jira: Bit
  confluence: Bit
  website: Bit
  gdrive: Bit
  app1: Bit
  person: PersonBit
  apps: Setting
}

export type AppType = IntegrationType | 'person'

type ModelFromType<A extends AppType> = AppTypeToModelType[A]

export type OrbitGenericProps<T extends ResolvableModel> = {
  model?: T
  isExpanded?: boolean
  shownLimit?: number
  searchTerm?: string
  hide?: ItemHideProps
  extraProps?: ItemResolverExtraProps
}

export type OrbitGenericAppProps<A extends AppType> = OrbitGenericProps<ModelFromType<A>>

export type ItemProps<A extends GenericBit<any>> = OrbitGenericProps<any> & {
  bit: A
}

export type OrbitAppProps<A extends AppType> = OrbitGenericProps<ModelFromType<A>> & {
  bit: GenericBit<A>
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
  id?: number
  display?: {
    name: string
    icon?: string
    iconLight?: string
  }
  source: ModelFromType<A>['target']
  integration?: A
  integrationName?: string
  instanceConfig?: AppConfig
  defaultQuery?: any | FindOptions<ModelFromType<A>> // TODO umed
  views: {
    main: Component<OrbitAppMainProps<A>, any, any>
    item: Component<OrbitAppProps<A>, any, any>
    setting?: Component<OrbitAppProps<A>, any, any>
    setup?: Component<any>
  }
}

export type OrbitApps = { [key in AppType]: OrbitApp<AppType> }

export type GetOrbitApp<A extends AppType> = (setting: IntegrationSetting<A>) => OrbitApp<A>

export type GetOrbitApps = { [key in AppType]: GetOrbitApp<AppType> }

export type ResolvableModel = Bit | PersonBit | Setting

export type ItemHideProps = {
  people?: boolean
  title?: boolean
  icon?: boolean
  subtitle?: boolean
  body?: boolean
  itemDate?: boolean
  date?: boolean
  meta?: boolean
}

export type ItemResolverExtraProps = {
  beforeTitle?: React.ReactNode
  minimal?: boolean
  preventSelect?: boolean
}
