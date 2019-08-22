import { KitStores } from '@o/kit'
import { createContext } from 'react'

import { NewAppStore } from './om/NewAppStore'
import { OrbitStore } from './pages/OrbitPage/OrbitStore'

export type AllStores = KitStores & {
  orbitStore?: OrbitStore
  newAppStore?: NewAppStore
}

export const StoreContext = createContext<AllStores>({})
