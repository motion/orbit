import { AppWithDefinition, useActiveAppsWithDefinition } from './useActiveAppsWithDefinition'

export const isDataDefinition = (x: AppWithDefinition) =>
  !!x.definition.sync ||
  // for now just check if key exists, .node.ts is filtered out webpack but key remains
  !!Object.keys(x.definition).some(x => x === 'graph')

export function useActiveDataApps(type?: string) {
  return useActiveAppsWithDefinition(type)
    .filter(isDataDefinition)
    .map(x => x.app)
}

export function useActiveDataAppsWithDefinition(type?: string) {
  return useActiveAppsWithDefinition(type).filter(isDataDefinition)
}
