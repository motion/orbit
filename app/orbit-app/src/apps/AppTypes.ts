import { AppConfig, AppStore } from '@mcro/kit'
import { AppBit } from '@mcro/models'
import { FunctionComponent } from 'react'
import { GenericComponent } from '../types'

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

export type AppViews = {
  index?: GenericComponent<AppProps> | false
  main?: GenericComponent<AppProps> | false
  toolBar?: GenericComponent<AppProps> | false
  statusBar?: GenericComponent<AppProps> | false
}

export type AppDefinition =
  // migrating to
  | GenericComponent<AppProps>
  // legacy, migrating away from
  | AppViews
