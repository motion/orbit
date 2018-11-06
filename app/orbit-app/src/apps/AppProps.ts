import { AppStore } from './AppStore'
import { AppType } from './apps'
import { SourcesStore } from '../stores/SourcesStore'
import { SettingStore } from '../stores/SettingStore'
import { SubPaneStore } from '../components/SubPaneStore'

export type AppProps = {
  title: string
  type: AppType
  appStore: AppStore
  sourcesStore: SourcesStore
  settingStore: SettingStore
  subPaneStore?: SubPaneStore
}
