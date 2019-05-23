import { AppBit } from '@o/models'

import { getAppDefinition } from '../helpers/getAppDefinition'
import { AppDefinition } from '../types/AppTypes'
import { useActiveApps } from './useActiveApps'

export type AppWithDefinition = {
  definition: AppDefinition
  app: AppBit
}

export function useActiveAppsWithDefinition(type?: string): AppWithDefinition[] {
  return (
    useActiveApps(type)
      .map(app => ({
        definition: getAppDefinition(app.identifier),
        app,
      }))
      // we may not have loaded definition yet...
      .filter(x => !!x.definition)
  )
}
