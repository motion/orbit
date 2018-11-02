import { AppStore } from './AppStore'
import { AppType } from './apps'
import { SourcesStore } from '../stores/SourcesStore'
import { SettingStore } from '../stores/SettingStore'

export type AppProps = {
  title: string
  type: AppType
  appStore: AppStore
  sourcesStore: SourcesStore
  settingStore: SettingStore
  setResults: AppStore['setResults']
}
