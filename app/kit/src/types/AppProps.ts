import { AppStore } from '../stores/AppStore'
import { AppConfig } from './AppConfig'

export type AppProps = {
  appConfig?: AppConfig
  id?: string
  viewType?: 'index' | 'main' | 'setup' | 'settings' | 'toolBar' | 'statusBar'
  title?: string
  appStore: AppStore
  isActive?: boolean | (() => boolean)
}
