import { AppBit, AppDefinition } from '@o/models'

import { config } from '../configureKit'
import { useActiveApps } from './useActiveApps'
import { useStores } from './useStores'

export function useActiveApp(): AppBit | null {
  const { paneManagerStore } = useStores()
  const activeApps = useActiveApps()
  return activeApps.find(x => `${x.id}` === paneManagerStore.activePane.id) || null
}

// because defs can be loaded statically, they use a different source

export function useActiveAppDefinition(): AppDefinition | null {
  const app = useActiveApp() || { identifier: 'loading' }
  const loadedApps = config.getLoadedApps!()
  return (loadedApps && loadedApps.find(x => x.id === app.identifier)) || null
}
