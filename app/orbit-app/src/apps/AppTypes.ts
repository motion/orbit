import { AppConfig } from '@mcro/models'
import { AppStore } from './AppStore'

export type AppProps = {
  appConfig?: AppConfig
  id?: string | number
  viewType?: 'index' | 'main' | 'setup' | 'settings'
  title?: string
  appStore: AppStore
  isActive?: boolean | (() => boolean)
}

export type AppView = (props: AppProps) => React.ReactNode

export type AppViews = {
  index: AppView
  main: AppView
}

export type AppDefinition =
  // migrating to
  | AppView
  | (() => AppViews)
  // legacy, migrating away from
  | AppViews
