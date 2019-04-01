import { KitStores } from '@o/kit'
import { createContext } from 'react'
import { AppFrameStore } from '../pages/AppPage/AppFrame'
import { AppPageStore } from '../pages/AppPage/AppPageStore'
import { MenuStore } from '../pages/ChromePage/menuLayer/Menu'
import { OrbitStore } from '../pages/OrbitPage/OrbitStore'
import { HeaderStore } from '../stores/HeaderStore'
import { NewAppStore } from '../stores/NewAppStore'
import { OrbitWindowStore } from '../stores/OrbitWindowStore'

export type AllStores = KitStores & {
  orbitWindowStore?: OrbitWindowStore
  appPageStore?: AppPageStore
  appFrameStore?: AppFrameStore
  menuStore?: MenuStore
  orbitStore?: OrbitStore
  newAppStore?: NewAppStore
  headerStore?: HeaderStore
}

export const StoreContext = createContext<AllStores>({})
