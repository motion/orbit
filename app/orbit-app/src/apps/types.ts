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

// typeof BitModel | typeof SettingModel | typeof PersonBitModel

type IntegrationTypeToModelType = {
  slack: Bit
  github: Bit
  gmail: Bit
  jira: Bit
  confluence: Bit
  website: Bit
  gdrive: Bit
  app1: Bit
  people: PersonBit
  apps: Setting
}

export type ItemResolverProps<T extends ResolvableModel> = {
  model?: T
  isExpanded?: boolean
  shownLimit?: number
  searchTerm?: string
  hide?: ItemHideProps
  extraProps?: ItemResolverExtraProps
}

export type ItemProps<A extends GenericBit<any>> = ItemResolverProps<any> & {
  bit: A
}

type ModelFromIntegration<A extends IntegrationType> = IntegrationTypeToModelType[A]

export type OrbitAppProps<A extends IntegrationType> = ItemResolverProps<
  ModelFromIntegration<A>
> & {
  bit: GenericBit<A>
  normalizedItem: NormalizedItem
}

export type OrbitAppMainProps<A extends IntegrationType> = OrbitAppProps<A> & {
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

export type OrbitApp<A extends IntegrationType> = {
  display?: {
    name: string
    icon?: string
    iconLight?: string
  }
  source: 'bit' | 'person-bit' | 'setting'
  integration: A
  integrationName: string
  instanceConfig?: AppConfig
  defaultQuery?: FindOptions<ModelFromIntegration<A>>
  views: {
    main: Component<OrbitAppMainProps<A>, any, any>
    item: Component<OrbitAppProps<A>, any, any>
    setting: Component<OrbitAppProps<A>, any, any>
    setup?: Component<any>
  }
}

export type OrbitApps = { [key in IntegrationType]: OrbitApp<IntegrationType> }

export type GetOrbitApp<A extends IntegrationType> = (setting: IntegrationSetting<A>) => OrbitApp<A>

export type GetOrbitApps = { [key in IntegrationType]: GetOrbitApp<IntegrationType> }

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
