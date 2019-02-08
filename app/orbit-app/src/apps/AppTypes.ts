import { AppConfig } from '@mcro/models'
import { GenericComponent } from '../types'
import { AppStore } from './AppStore'

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
