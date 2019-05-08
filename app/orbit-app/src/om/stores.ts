import { PaneManagerStore, QueryStore, SpaceStore, ThemeStore } from '@o/kit'
import { createUsableStore } from '@o/use-store'

import { OrbitStore } from '../pages/OrbitPage/OrbitStore'
import { HeaderStore } from '../stores/HeaderStore'
import { NewAppStore } from '../stores/NewAppStore'
import { OrbitWindowStore } from '../stores/OrbitWindowStore'

export const themeStore = createUsableStore(ThemeStore)
export const useThemeStore = themeStore.useStore

export const orbitStore = createUsableStore(OrbitStore)
export const useOrbitStore = orbitStore.useStore

export const queryStore = createUsableStore(QueryStore)
export const useQueryStore = queryStore.useStore

export const headerStore = createUsableStore(HeaderStore)
export const useHeaderStore = headerStore.useStore

export const orbitWindowStore = createUsableStore(OrbitWindowStore, { queryStore })
export const useOrbitWindowStore = orbitWindowStore.useStore

export const newAppStore = createUsableStore(NewAppStore)
export const useNewAppStore = newAppStore.useStore

const loadingPane = {
  id: 'loading',
  name: 'Loading',
  type: 'loading',
  isHidden: true,
  keyable: true,
}

export const paneManagerStore = createUsableStore(PaneManagerStore, {
  defaultIndex: 0,
  defaultPanes: [loadingPane],
})
export const usePaneManagerStore = paneManagerStore.useStore

export const spaceStore = createUsableStore(SpaceStore, { paneManagerStore })
export const useSpaceStore = spaceStore.useStore

export const Stores = {
  themeStore,
  orbitStore,
  headerStore,
  queryStore,
  orbitWindowStore,
  newAppStore,
  paneManagerStore,
  spaceStore,
}
