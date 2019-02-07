import { AppConfig } from '@mcro/models'
import { GenericComponent } from '../types'
import { AppStore } from './AppStore'

export type AppProps = {
  appConfig?: AppConfig
  id?: string
  viewType?: 'index' | 'main' | 'setup' | 'settings'
  title?: string
  appStore: AppStore
  isActive?: boolean | (() => boolean)
}

export type AppDefinition =
  // migrating to
  | GenericComponent<AppProps>
  // legacy, migrating away from
  | {
      index: GenericComponent<AppProps>
      main: GenericComponent<AppProps>
    }
