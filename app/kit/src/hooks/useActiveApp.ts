import { AppBit, AppDefinition } from '@o/models'

import { config } from '../configureKit'
import { useActiveApps } from './useActiveApps'
import { useStores } from './useStores'

export function useActiveApp(): AppBit {
  const { paneManagerStore } = useStores()
  const activeApps = useActiveApps()
  return activeApps.find(x => `${x.id}` === paneManagerStore.activePane.id)
}

// because defs can be loaded statically, they use a different source

export function useActiveAppDefinition(): AppDefinition {
  const app = useActiveApp() || { identifier: 'loading' }
  return config.getLoadedApps().find(x => x.id === app.identifier)
}
