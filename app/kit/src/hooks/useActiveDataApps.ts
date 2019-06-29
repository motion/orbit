import { AppDefinition } from '@o/models'
import { useMemo } from 'react'

import { FindBitWhere } from './useActiveApps'
import { useActiveAppsWithDefinition } from './useActiveAppsWithDefinition'

export const hasGraph = (x: AppDefinition) => !!Object.keys(x).some(x => x === 'graph')

// imperfect, for now
export const isDataDefinition = (x: AppDefinition) => x && !x.app

export function useActiveDataApps(where?: FindBitWhere) {
  const appsWithDefs = useActiveAppsWithDefinition(where)
  return useMemo(() => appsWithDefs.filter(x => isDataDefinition(x.definition)).map(x => x.app), [
    appsWithDefs,
  ])
}

export function useActiveDataAppsWithDefinition(where?: FindBitWhere) {
  const appsWithDefs = useActiveAppsWithDefinition(where)
  return useMemo(() => appsWithDefs.filter(x => isDataDefinition(x.definition)), [appsWithDefs])
}
