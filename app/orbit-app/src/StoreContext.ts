import { KitStores } from '@o/kit'
import { createContext } from 'react'

import { OrbitStore } from './pages/OrbitPage/OrbitStore'
import { NewAppStore } from './stores/NewAppStore'

export type AllStores = KitStores & {
  orbitStore?: OrbitStore
  newAppStore?: NewAppStore
}

export const StoreContext = createContext<AllStores>({})
