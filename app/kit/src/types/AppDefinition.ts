import { Source } from '@mcro/models'
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
  name: string
  icon: string
  iconLight?: string
  defaultViewConfig?: AppConfig['viewConfig']
  context?: React.Context<any>
  itemType?:
    | 'task'
    | 'document'
    | 'webpage'
    | 'thread'
    | 'conversation'
    | 'markdown'
    | 'text'
    | 'task'
    | 'person'
  app?: FunctionComponent<AppProps>
  settings?: FunctionComponent<null>
  appData?: Object
  sync?: {
    sourceType?: string
    // TODO remove and just use bit
    modelType?: 'person-bit' | 'bit'
    settings?: FunctionComponent<OrbitSourceSettingProps<Source>>
    setup?: FunctionComponent<any>
  }
}

export type OrbitSourceMainProps = OrbitItemViewProps<any> & {
  searchBar: SearchBarType
  searchTerm: string
}

export type OrbitSourceSettingProps<T extends Source> = {
  appConfig?: AppConfig
  source: T
}
