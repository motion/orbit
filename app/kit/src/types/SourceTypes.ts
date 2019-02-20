import { Bit, PersonBit, Source } from '@mcro/models'
import { SearchBarType } from '@mcro/ui'
import * as React from 'react'
import { FindOptions } from 'typeorm'
import { AppConfig } from './AppConfig'
import { ItemType } from './ItemType'
import { OrbitItemViewProps } from './OrbitItemViewProps'

type GenericComponent<T> = React.ComponentClass<T> | React.SFC<T>

type AppTypeToModelType = {
  slack: Bit
  github: Bit
  gmail: Bit
  jira: Bit
  confluence: Bit
  website: Bit
  drive: Bit
  person: PersonBit
  pinned: any
}

type ModelFromType<A extends ItemType> = AppTypeToModelType[A]

export type OrbitSourceMainProps<A extends ItemType> = OrbitItemViewProps<A> & {
  searchBar: SearchBarType
  searchTerm: string
}

export type OrbitSourceSettingProps<T extends Source> = {
  appConfig?: AppConfig
  source: T
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
  defaultQuery?: FindOptions<ModelFromType<A>>
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
