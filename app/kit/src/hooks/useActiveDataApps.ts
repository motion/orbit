import { AppDefinition } from '../types/AppDefinition'
import { AppWithDefinition, useActiveAppsWithDefinition } from './useActiveAppsWithDefinition'

export const hasGraph = (x: AppDefinition) => !!Object.keys(x).some(x => x === 'graph')

export const isDataDefinition = (x: AppWithDefinition) =>
  !!x.definition.sync ||
  // for now just check if key exists, .node.ts is filtered out webpack but key remains
  hasGraph(x.definition)

export function useActiveDataApps(type?: string) {
  return useActiveAppsWithDefinition(type)
    .filter(isDataDefinition)
    .map(x => x.app)
}

export function useActiveDataAppsWithDefinition(type?: string) {
  return useActiveAppsWithDefinition(type).filter(isDataDefinition)
}
