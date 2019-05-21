import { AppDefinition } from '../types/AppTypes'
import { useActiveAppsWithDefinition } from './useActiveAppsWithDefinition'

export const hasGraph = (x: AppDefinition) => !!Object.keys(x).some(x => x === 'graph')

export const isDataDefinition = (x: AppDefinition) =>
  !!x.sync ||
  // for now just check if key exists, .node.ts is filtered out webpack but key remains
  hasGraph(x)

export function useActiveDataApps(type?: string) {
  return useActiveAppsWithDefinition(type)
    .filter(x => isDataDefinition(x.definition))
    .map(x => x.app)
}

export function useActiveDataAppsWithDefinition(type?: string) {
  return useActiveAppsWithDefinition(type).filter(x => isDataDefinition(x.definition))
}
