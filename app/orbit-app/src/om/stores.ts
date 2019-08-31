import { PaneManagerStore, QueryStore, ThemeStore } from '@o/kit'
import { createUsableStore } from '@o/use-store'

import { OrbitStore } from '../pages/OrbitPage/OrbitStore'
import { NewAppStore } from './NewAppStore'
import { OrbitWindowStore } from './OrbitWindowStore'

export const themeStore = createUsableStore(ThemeStore)
export const useThemeStore = themeStore.useStore

export const orbitStore = createUsableStore(OrbitStore)
export const useOrbitStore = orbitStore.useStore

export const queryStore = createUsableStore(QueryStore)
export const useQueryStore = queryStore.useStore

export const orbitWindowStore = createUsableStore(OrbitWindowStore, { queryStore })
export const useOrbitWindowStore = orbitWindowStore.useStore

export const newAppStore = createUsableStore(NewAppStore)
export const useNewAppStore = newAppStore.useStore

export const paneManagerStore = createUsableStore(PaneManagerStore)
export const usePaneManagerStore = paneManagerStore.useStore

export const Stores = {
  themeStore,
  orbitStore,
  queryStore,
  orbitWindowStore,
  newAppStore,
  paneManagerStore,
}

process.env.NODE_ENV === 'development' && module['hot'] && module['hot'].accept()
