import { AppType, AppConfig, AppData } from '@mcro/models'
import { IntegrationType } from '@mcro/models'
import { AppStore } from './AppStore'
import { SourcesStore } from '../stores/SourcesStore'
import { SettingStore } from '../stores/SettingStore'
import { SubPaneStore } from '../components/SubPaneStore'
import { QueryStore } from '../stores/QueryStore/QueryStore'
import { SelectionStore } from '../stores/SelectionStore'
import { PaneManagerStore } from '../stores/PaneManagerStore'
import { SpaceStore } from '../stores/SpaceStore'
import { HandleSelection, ListItemProps } from '../views/ListItems/ListItem'

export type AppProps<Type extends AppType> = {
  id: number
  viewType: 'index' | 'main' | 'setup'
  type: Type
  title?: string
  onSelectItem?: HandleSelection
  onOpenItem?: HandleSelection

  // TODO this is all confused, were moving this onto AppEntity/AppModel
  data?: AppData[Type]
  updateData?: (values: Partial<AppData[Type]>) => void

  sourceType?: IntegrationType
  appStore: AppStore<Type>
  spaceStore: SpaceStore
  sourcesStore: SourcesStore
  settingStore: SettingStore
  queryStore: QueryStore
  selectionStore?: SelectionStore
  isActive?: boolean | (() => boolean)
  subPaneStore?: SubPaneStore
  paneManagerStore?: PaneManagerStore
  itemProps?: Partial<ListItemProps>
  appConfig?: AppConfig
}
