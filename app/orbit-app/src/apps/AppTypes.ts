import { AppConfig, AppStore } from '@mcro/kit'
import { AppBit } from '@mcro/models'
import { FunctionComponent } from 'react'

type AppBitOf<A> = AppBit & { data: A }

export interface App<A> extends FunctionComponent<AppProps> {
  defaultValue: A
  api: {
    receive(bit: AppBitOf<A>, ...args: any[]): any
  }
}

export type AppProps = {
  appConfig?: AppConfig
  id?: string
  viewType?: 'index' | 'main' | 'setup' | 'settings' | 'toolBar' | 'statusBar'
  title?: string
  appStore: AppStore
  isActive?: boolean | (() => boolean)
}

export type AppElements = {
  index?: React.ReactElement<any>
  children?: React.ReactElement<any>
  statusBar?: React.ReactElement<any>
  toolBar?: React.ReactElement<any>
  provideStores?: Object
}

type SettingsView = FunctionComponent<null> | false

export type AppViews = {
  index?: FunctionComponent<AppProps> | false
  main?: FunctionComponent<AppProps> | false
  toolBar?: FunctionComponent<AppProps> | false
  statusBar?: FunctionComponent<AppProps> | false
  settings?: SettingsView
}

export interface AppFnDefinition extends FunctionComponent<AppProps> {
  settings?: SettingsView
}

export type AppDefinition =
  // were migrating to...
  | AppFnDefinition
  // ...away from
  | AppViews
