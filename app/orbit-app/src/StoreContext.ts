import { KitStores } from '@o/kit'
import { createContext } from 'react'

import { OrbitStore } from './pages/OrbitPage/OrbitStore'
import { NewAppStore } from './stores/NewAppStore'
import { OrbitWindowStore } from './stores/OrbitWindowStore'

export type AllStores = KitStores & {
  orbitWindowStore?: OrbitWindowStore
  orbitStore?: OrbitStore
  newAppStore?: NewAppStore
}

export const StoreContext = createContext<AllStores>({})
