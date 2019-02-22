import { AppBit, Source } from '@mcro/models'
import { SearchBarType } from '@mcro/ui'
import * as React from 'react'
import { AppConfig } from './AppConfig'
import { OrbitItemViewProps } from './OrbitItemViewProps'

type GenericComponent<T> = React.ComponentClass<T> | React.SFC<T>

export type OrbitSourceMainProps = OrbitItemViewProps<any> & {
  searchBar: SearchBarType
  searchTerm: string
}

export type OrbitSourceSettingProps<T extends Source> = {
  appConfig?: AppConfig
  source: T
}

export type OrbitSource = {
  name?: string
  app?: AppBit
  sourceType?: string
  itemName?: string
  icon?: string
  iconLight?: string
  modelType: string
  viewConfig?: AppConfig['viewConfig']
  views: {
    main: GenericComponent<OrbitSourceMainProps>
    item: GenericComponent<OrbitItemViewProps<any>>
    setting?: GenericComponent<OrbitSourceSettingProps<Source>>
    setup?: GenericComponent<any>
  }
}

export type OrbitSources = { [key: string]: OrbitSource }
