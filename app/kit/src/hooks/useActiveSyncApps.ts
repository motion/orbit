import { useActiveAppsWithDefinition } from './useActiveAppsWithDefinition'

export function useActiveSyncApps(type?: string) {
  return useActiveAppsWithDefinition(type)
    .filter(x => !!x.definition.sync)
    .filter(x => x.app.tabDisplay !== 'hidden')
    .map(x => x.app)
}

export function useActiveSyncAppsWithDefinition(type?: string) {
  return useActiveAppsWithDefinition(type)
    .filter(x => !!x.definition.sync)
    .filter(x => x.app.tabDisplay !== 'hidden')
}
