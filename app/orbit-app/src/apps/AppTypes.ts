import { AppBit, IntegrationType } from '@mcro/models'
import { FunctionComponent } from 'react'
import { GenericComponent } from '../types'
import { AppStore } from './AppStore'

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

export enum AppType {
  search = 'search',
  people = 'people',
  topics = 'topics',
  lists = 'lists',
  sources = 'sources',
  bit = 'bit',
  settings = 'settings',
  message = 'message',
  apps = 'apps',
  createApp = 'createApp',
  onboard = 'onboard',
  custom = 'custom',
  spaces = 'spaces',
}

export type AppConfig = {
  id?: string
  subId?: string
  title?: string
  type?: AppType
  data?: any
  icon?: string
  iconLight?: string
  integration?: IntegrationType
  subType?: string
  viewType?: 'main' | 'index' | 'setup'
  // allow various things to be passed as config
  // to help configure the peek window
  viewConfig?: {
    showTitleBar?: boolean
    viewPane?: string
    dimensions?: [number, number]
    // for auto measuring peek size
    contentSize?: number
    initialState?: { [key: string]: any }
  }
}
