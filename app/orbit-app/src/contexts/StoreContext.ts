import { KitStores } from '@mcro/kit'
import { UIStores } from '@mcro/ui'
import { createContext } from 'react'
import { AppFrameStore } from '../pages/AppPage/AppFrame'
import { AppPageStore } from '../pages/AppPage/AppPageStore'
import { MenuStore } from '../pages/ChromePage/menuLayer/Menu'
import { SidebarStore } from '../pages/OrbitPage/OrbitSidebar'
import { OrbitStore } from '../pages/OrbitPage/OrbitStore'
import { HeaderStore } from '../stores/HeaderStore'
import { NewAppStore } from '../stores/NewAppStore'
import { OrbitWindowStore } from '../stores/OrbitWindowStore'

export type AllStores = UIStores &
  KitStores & {
    orbitWindowStore?: OrbitWindowStore
    appPageStore?: AppPageStore
    appFrameStore?: AppFrameStore
    menuStore?: MenuStore
    orbitStore?: OrbitStore
    newAppStore?: NewAppStore
    headerStore?: HeaderStore
    sidebarStore?: SidebarStore
  }

export const StoreContext = createContext({} as AllStores)
