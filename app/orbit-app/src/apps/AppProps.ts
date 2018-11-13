import { AppType } from '@mcro/models'
import { IntegrationType } from '@mcro/models'
import { AppStore } from './AppStore'
import { SourcesStore } from '../stores/SourcesStore'
import { SettingStore } from '../stores/SettingStore'
import { SubPaneStore } from '../components/SubPaneStore'
import { QueryStore } from '../stores/QueryStore/QueryStore'
import { SelectionStore } from '../stores/SelectionStore'
import { PaneManagerStore } from '../stores/PaneManagerStore'

export type AppProps = {
  id: string
  viewType: 'index' | 'main' | 'setup'
  title: string
  type: AppType
  sourceType?: IntegrationType
  appStore?: AppStore
  sourcesStore?: SourcesStore
  settingStore?: SettingStore
  queryStore?: QueryStore
  selectionStore?: SelectionStore
  isActive?: boolean | (() => boolean)
  subPaneStore?: SubPaneStore
  paneManagerStore?: PaneManagerStore
}
