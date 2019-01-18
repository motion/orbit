import { AppConfig, AppData, AppType } from '@mcro/models'
import { SubPaneStore } from '../components/SubPaneStore'
import { PaneManagerStore } from '../stores/PaneManagerStore'
import { QueryStore } from '../stores/QueryStore/QueryStore'
import { SelectionStore } from '../stores/SelectionStore'
import { SettingStore } from '../stores/SettingStore'
import { SourcesStore } from '../stores/SourcesStore'
import { SpaceStore } from '../stores/SpaceStore'
import { OrbitListItemProps } from '../views/ListItems/OrbitListItem'
import { OrbitHandleSelect } from '../views/Lists/OrbitList'
import { AppStore } from './AppStore'

export type AppProps<Type extends AppType> = {
  id: number
  viewType: 'index' | 'main' | 'setup'
  type: Type
  title?: string
  onSelectItem?: OrbitHandleSelect
  onOpenItem?: OrbitHandleSelect

  // TODO this is all confused, were moving this onto AppEntity/AppModel
  data?: AppData[Type]
  updateData?: (values: Partial<AppData[Type]>) => void

  appStore: AppStore<Type>
  spaceStore: SpaceStore
  sourcesStore: SourcesStore
  settingStore: SettingStore
  queryStore: QueryStore
  selectionStore?: SelectionStore
  isActive?: boolean | (() => boolean)
  subPaneStore?: SubPaneStore
  paneManagerStore?: PaneManagerStore
  itemProps?: Partial<OrbitListItemProps>
  appConfig?: AppConfig
}
