import { useActiveAppsWithDefinition } from './useActiveAppsWithDefinition'

export function useActiveSyncApps() {
  console.log('useActiveAppsWithDefinition()', useActiveAppsWithDefinition())

  return useActiveAppsWithDefinition()
    .filter(x => !!x.definition.sync)
    .map(x => x.app)
}

export function useActiveSyncAppsWithDefinition() {
  return useActiveAppsWithDefinition().filter(x => !!x.definition.sync)
}
