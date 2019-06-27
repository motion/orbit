import { AppDefinition } from '@o/models'

import { useActiveAppsWithDefinition } from './useActiveAppsWithDefinition'
import { FindBitWhere } from './useActiveApps'

export const hasGraph = (x: AppDefinition) => !!Object.keys(x).some(x => x === 'graph')

// imperfect, for now
export const isDataDefinition = (x: AppDefinition) => x && !x.app

export function useActiveDataApps(where?: FindBitWhere) {
  return useActiveAppsWithDefinition(where)
    .filter(x => isDataDefinition(x.definition))
    .map(x => x.app)
}

export function useActiveDataAppsWithDefinition(where?: FindBitWhere) {
  return useActiveAppsWithDefinition(where).filter(x => isDataDefinition(x.definition))
}
