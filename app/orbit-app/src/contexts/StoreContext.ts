import { UIStores } from '@mcro/ui'
import { createContext } from 'react'
import { AppsStore } from '../apps/AppsStore'
import { AppStore } from '../apps/AppStore'
import { ListStore } from '../apps/lists/ListStore'
import { SearchStore } from '../apps/search/SearchStore'
import { SubPaneStore } from '../components/SubPaneStore'
import { AppFrameStore } from '../pages/AppPage/AppFrame'
import { AppPageStore } from '../pages/AppPage/AppPageStore'
import { MenuStore } from '../pages/ChromePage/menuLayer/Menu'
import { SidebarStore } from '../pages/OrbitPage/OrbitSidebar'
import { OrbitStore } from '../pages/OrbitPage/OrbitStore'
import { HeaderStore } from '../stores/HeaderStore'
import { NewAppStore } from '../stores/NewAppStore'
import { OrbitWindowStore } from '../stores/OrbitWindowStore'
import { PaneManagerStore } from '../stores/PaneManagerStore'
import { QueryStore } from '../stores/QueryStore/QueryStore'
import { SettingStore } from '../stores/SettingStore'
import { ShortcutStore } from '../stores/ShortcutStore'
import { SourcesStore } from '../stores/SourcesStore'
import { SpaceStore } from '../stores/SpaceStore'
import { ThemeStore } from '../stores/ThemeStore'

export type AllStores = UIStores & {
  queryStore?: QueryStore
  paneManagerStore?: PaneManagerStore
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
  searchStore?: SearchStore
  sidebarStore?: SidebarStore
  themeStore?: ThemeStore
  listStore?: ListStore
}

export const StoreContext = createContext({} as AllStores)
