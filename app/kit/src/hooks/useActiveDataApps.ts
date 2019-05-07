import { AppWithDefinition, useActiveAppsWithDefinition } from './useActiveAppsWithDefinition'

const isDataDefinition = (x: AppWithDefinition) => !!x.definition.sync || !!x.definition.graph

export function useActiveDataApps(type?: string) {
  return useActiveAppsWithDefinition(type)
    .filter(isDataDefinition)
    .map(x => x.app)
}

export function useActiveDataAppsWithDefinition(type?: string) {
  return useActiveAppsWithDefinition(type).filter(isDataDefinition)
}
