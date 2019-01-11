import { createContext } from 'react'
import { QueryStore } from './stores/QueryStore/QueryStore'
import { PaneManagerStore } from './stores/PaneManagerStore'
import { SelectionStore } from './stores/SelectionStore'
import { SourcesStore } from './stores/SourcesStore'
import { SpaceStore } from './stores/SpaceStore'
import { SettingStore } from './stores/SettingStore'
import { OrbitWindowStore } from './stores/OrbitWindowStore'
import { AppStore } from './apps/AppStore'
import { AppPageStore } from './pages/AppPage/AppPageStore'
import { ShortcutStore } from './stores/ShortcutStore'
import { AppInfoStore } from './components/AppInfoStore'
import { SubPaneStore } from './components/SubPaneStore'
import { AppFrameStore } from './pages/AppPage/AppFrame'

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
  appInfoStore?: AppInfoStore
  subPaneStore?: SubPaneStore
  appFrameStore?: AppFrameStore
}

export const StoreContext = createContext({} as AllStores)
