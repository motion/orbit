import { PaneManagerStore, QueryStore, SpaceStore, ThemeStore } from '@o/kit'
import { createUsableStore } from '@o/use-store'

import { OrbitStore } from '../pages/OrbitPage/OrbitStore'
import { NewAppStore } from '../stores/NewAppStore'
import { OrbitWindowStore } from '../stores/OrbitWindowStore'

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

export const paneManagerStore = createUsableStore(PaneManagerStore, {
  defaultPaneId: 'home',
  defaultPanes: [
    {
      id: 'home',
      name: 'Home',
      type: 'home',
      isHidden: true,
    },
  ],
})
export const usePaneManagerStore = paneManagerStore.useStore

export const spaceStore = createUsableStore(SpaceStore, { paneManagerStore })
export const useSpaceStore = spaceStore.useStore

export const Stores = {
  themeStore,
  orbitStore,
  queryStore,
  orbitWindowStore,
  newAppStore,
  paneManagerStore,
  spaceStore,
}
