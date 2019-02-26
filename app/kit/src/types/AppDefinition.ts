import { AppBit, ItemType } from '@mcro/models'
import { SearchBarType } from '@mcro/ui'
import * as React from 'react'
import { FunctionComponent } from 'react'
import { AppConfig } from './AppConfig'
import { AppProps } from './AppProps'
import { OrbitItemViewProps } from './OrbitItemViewProps'

type SettingsView = FunctionComponent<null> | false

export type AppElements = {
  index?: React.ReactElement<any>
  children?: React.ReactElement<any>
  statusBar?: React.ReactElement<any>
  toolBar?: React.ReactElement<any>
  provideStores?: Object
}

export type AppViews = {
  index?: FunctionComponent<AppProps> | false | null
  main?: FunctionComponent<AppProps> | false | null
  toolBar?: FunctionComponent<AppProps> | false | null
  statusBar?: FunctionComponent<AppProps> | false | null
  settings?: SettingsView
}

export type AppDefinition = {
  id: string
  name: string
  icon: string
  iconLight?: string
  defaultViewConfig?: AppConfig['viewConfig']
  context?: React.Context<any>
  itemType?: ItemType
  app?: FunctionComponent<AppProps>
  settings?: FunctionComponent<null>
  appData?: Object
  sync?: {
    // TODO remove and just use bit
    modelType?: 'person-bit' | 'bit'
    settings?: FunctionComponent<AppSettingsProps<AppBit>>
    setup?: FunctionComponent<any>
  }
  API?: {
    receive(app: AppBit, parentID: number, child: any): any
  }
}

export type AppBitMainProps = OrbitItemViewProps<any> & {
  searchBar: SearchBarType
  searchTerm: string
}

export type AppSettingsProps<T extends AppBit> = {
  appConfig?: AppConfig
  app: T
}
