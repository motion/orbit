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

type ModelFromIntegration<A extends IntegrationType> = IntegrationTypeToModelType[A]

export type OrbitAppProps<A extends IntegrationType> = ItemResolverProps<
  ModelFromIntegration<A>
> & {
  bit: GenericBit<A>
}

export type OrbitAppMainProps<A extends IntegrationType> = OrbitAppProps<A> & {
  appStore: AppStore
  searchBar: React.ReactNode
  searchTerm: string
}

export type OrbitApp<A extends IntegrationType> = {
  source: 'bit' | 'person-bit' | 'setting'
  integration: A
  integrationName: string
  displayName: string
  instanceConfig?: AppConfig
  defaultQuery?: FindOptions<ModelFromIntegration<A>>
  views: {
    main: Component<OrbitAppMainProps<A>, any, any>
    item: Component<OrbitAppProps<A>, any, any>
    setting: Component<OrbitAppProps<A>, any, any>
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

export type ItemResolverProps<T extends ResolvableModel> = {
  model?: ResolvableModel
  isExpanded?: boolean
  shownLimit?: number
  searchTerm?: string
  hide?: ItemHideProps
  onResolvedItem?: (a: T) => any
  extraProps?: ItemResolverExtraProps
}

export type ItemProps<A extends GenericBit<any>> = ItemResolverProps<any> & {
  bit: A
}
