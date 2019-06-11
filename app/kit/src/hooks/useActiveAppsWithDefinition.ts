import { AppBit, AppDefinition } from '@o/models'
import { useMemo } from 'react'

import { getAppDefinition } from '../helpers/getAppDefinition'
import { useActiveApps } from './useActiveApps'

export type AppWithDefinition = {
  definition: AppDefinition
  app: AppBit
}

export function useActiveAppsWithDefinition(type?: string): AppWithDefinition[] {
  const activeApps = useActiveApps(type)
  return useMemo(() => {
    return (
      activeApps
        .map(app => ({
          definition: getAppDefinition(app.identifier),
          app,
        }))
        // we may not have loaded definition yet...
        .filter(x => !!x.definition)
    )
  }, [activeApps])
}
