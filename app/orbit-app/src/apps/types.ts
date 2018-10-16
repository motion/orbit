import { FindOptions } from 'typeorm'
import {
  IntegrationSetting,
  IntegrationType,
  SettingModel,
  PersonBitModel,
  BitModel,
  Bit,
  PersonBit,
  Setting,
  GenericBit,
} from '@mcro/models'
import { AppConfig } from '@mcro/stores'

// typeof BitModel | typeof SettingModel | typeof PersonBitModel

type IntegrationTypeToModelType = {
  slack: typeof BitModel
  github: typeof BitModel
  gmail: typeof BitModel
  jira: typeof BitModel
  confluence: typeof BitModel
  website: typeof BitModel
  gdrive: typeof BitModel
  app1: typeof BitModel
  people: typeof PersonBitModel
  apps: typeof SettingModel
}

type ModelTypeByIntegrationType<A extends IntegrationType> = IntegrationTypeToModelType[A]

export type OrbitApp<A extends IntegrationType> = {
  source: A
  integrationName: string
  displayName: string
  model: ModelTypeByIntegrationType<A>
  instanceConfig: AppConfig
  defaultQuery?: FindOptions<ModelTypeByIntegrationType<A>>
  views: {
    main: React.ReactNode
    item: React.ReactNode
    setting: React.ReactNode
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
