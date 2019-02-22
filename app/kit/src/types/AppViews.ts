import { FunctionComponent } from 'react'
import { AppProps } from './AppProps'

type SettingsView = FunctionComponent<null> | false

export type AppElements = {
  index?: React.ReactElement<any>
  children?: React.ReactElement<any>
  statusBar?: React.ReactElement<any>
  toolBar?: React.ReactElement<any>
  provideStores?: Object
}

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
