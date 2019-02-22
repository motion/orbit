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
  itemType: 'task' | 'document' | 'webpage' | 'thread' | 'chat' | 'markdown' | 'text' | 'task'
  // TODO remove and just use bit
  modelType: 'person-bit' | 'bit'
  sourceType: string
  icon: string
  iconLight?: string
  defaultViewConfig?: AppConfig['viewConfig']
  views: {
    app?: FunctionComponent<AppProps>
    main?: FunctionComponent<OrbitSourceMainProps>
    item?: FunctionComponent<OrbitItemViewProps<any>>
    settings?: FunctionComponent<null>
    sourceSettings?: FunctionComponent<OrbitSourceSettingProps<Source>>
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
