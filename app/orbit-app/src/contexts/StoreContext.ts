import { SourcesStore } from '@mcro/apps'
import { KitStores } from '@mcro/kit'
import { UIStores } from '@mcro/ui'
import { createContext } from 'react'
import { AppsStore } from '../apps/AppsStore'
import { ListStore } from '../apps/lists/ListStore'
import { SearchStore } from '../apps/search/SearchStore'
import { AppFrameStore } from '../pages/AppPage/AppFrame'
import { AppPageStore } from '../pages/AppPage/AppPageStore'
import { MenuStore } from '../pages/ChromePage/menuLayer/Menu'
import { SidebarStore } from '../pages/OrbitPage/OrbitSidebar'
import { OrbitStore } from '../pages/OrbitPage/OrbitStore'
import { HeaderStore } from '../stores/HeaderStore'
import { NewAppStore } from '../stores/NewAppStore'
import { OrbitWindowStore } from '../stores/OrbitWindowStore'
import { SettingStore } from '../stores/SettingStore'
import { SpaceStore } from '../stores/SpaceStore'
import { ThemeStore } from '../stores/ThemeStore'

export type AllStores = UIStores &
  KitStores & {
    sourcesStore?: SourcesStore
    spaceStore?: SpaceStore
    settingStore?: SettingStore
    orbitWindowStore?: OrbitWindowStore
    appsStore?: AppsStore
    appPageStore?: AppPageStore
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
