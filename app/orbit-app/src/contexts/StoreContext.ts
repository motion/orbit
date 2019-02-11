import { createContext } from 'react'
import { AppsStore } from '../apps/AppsStore'
import { AppStore } from '../apps/AppStore'
import { SubPaneStore } from '../components/SubPaneStore'
import { AppFrameStore } from '../pages/AppPage/AppFrame'
import { AppPageStore } from '../pages/AppPage/AppPageStore'
import { MenuStore } from '../pages/ChromePage/menuLayer/Menu'
import { OrbitStore } from '../pages/OrbitPage/OrbitStore'
import { HeaderStore } from '../stores/HeaderStore'
import { NewAppStore } from '../stores/NewAppStore'
import { OrbitWindowStore } from '../stores/OrbitWindowStore'
import { PaneManagerStore } from '../stores/PaneManagerStore'
import { QueryStore } from '../stores/QueryStore/QueryStore'
import { SelectionStore } from '../stores/SelectionStore'
import { SettingStore } from '../stores/SettingStore'
import { ShortcutStore } from '../stores/ShortcutStore'
import { SourcesStore } from '../stores/SourcesStore'
import { SpaceStore } from '../stores/SpaceStore'

export type AllStores = {
  queryStore?: QueryStore
  paneManagerStore?: PaneManagerStore
  selectionStore?: SelectionStore
  sourcesStore?: SourcesStore
  spaceStore?: SpaceStore
  settingStore?: SettingStore
  orbitWindowStore?: OrbitWindowStore
  appStore?: AppStore
  appsStore?: AppsStore
  appPageStore?: AppPageStore
  shortcutStore?: ShortcutStore
  subPaneStore?: SubPaneStore
  appFrameStore?: AppFrameStore
  menuStore?: MenuStore
  orbitStore?: OrbitStore
  newAppStore?: NewAppStore
  headerStore?: HeaderStore
}

export const StoreContext = createContext({} as AllStores)
