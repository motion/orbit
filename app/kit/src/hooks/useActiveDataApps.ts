import { AppDefinition } from '@o/models'

import { useActiveAppsWithDefinition } from './useActiveAppsWithDefinition'

export const hasGraph = (x: AppDefinition) => !!Object.keys(x).some(x => x === 'graph')

// imperfect, for now
export const isDataDefinition = (x: AppDefinition) => !x.app

export function useActiveDataApps(type?: string) {
  return useActiveAppsWithDefinition(type)
    .filter(x => isDataDefinition(x.definition))
    .map(x => x.app)
}

export function useActiveDataAppsWithDefinition(type?: string) {
  return useActiveAppsWithDefinition(type).filter(x => isDataDefinition(x.definition))
}
