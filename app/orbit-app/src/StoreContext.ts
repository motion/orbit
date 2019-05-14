import { KitStores } from '@o/kit'
import { createContext } from 'react'

import { MenuStore } from './pages/ChromePage/menuLayer/Menu'
import { OrbitStore } from './pages/OrbitPage/OrbitStore'
import { HeaderStore } from './stores/HeaderStore'
import { NewAppStore } from './stores/NewAppStore'
import { OrbitWindowStore } from './stores/OrbitWindowStore'

export type AllStores = KitStores & {
  orbitWindowStore?: OrbitWindowStore
  menuStore?: MenuStore
  orbitStore?: OrbitStore
  newAppStore?: NewAppStore
  headerStore?: HeaderStore
}

export const StoreContext = createContext<AllStores>({})
