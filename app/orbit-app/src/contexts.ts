import { createContext } from 'react'
import { AppStore } from './apps/AppStore'
import { SubPaneStore } from './components/SubPaneStore'
import { AppFrameStore } from './pages/AppPage/AppFrame'
import { AppPageStore } from './pages/AppPage/AppPageStore'
import { MenuStore } from './pages/ChromePage/menuLayer/Menu'
import { OrbitWindowStore } from './stores/OrbitWindowStore'
import { PaneManagerStore } from './stores/PaneManagerStore'
import { QueryStore } from './stores/QueryStore/QueryStore'
import { SelectionStore } from './stores/SelectionStore'
import { SettingStore } from './stores/SettingStore'
import { ShortcutStore } from './stores/ShortcutStore'
import { SourcesStore } from './stores/SourcesStore'
import { SpaceStore } from './stores/SpaceStore'

export type AllStores = {
  queryStore?: QueryStore
  paneManagerStore?: PaneManagerStore
  selectionStore?: SelectionStore
  sourcesStore?: SourcesStore
  spaceStore?: SpaceStore
  settingStore?: SettingStore
  orbitWindowStore?: OrbitWindowStore
  appStore?: AppStore<any>
  appPageStore?: AppPageStore
  shortcutStore?: ShortcutStore
  subPaneStore?: SubPaneStore
  appFrameStore?: AppFrameStore
  menuStore?: MenuStore
}

export const StoreContext = createContext({} as AllStores)
