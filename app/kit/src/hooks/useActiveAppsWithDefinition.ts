import { AppBit } from '@o/models'

import { getAppDefinition } from '../helpers/getAppDefinition'
import { AppDefinition } from '../types/AppDefinition'
import { useActiveApps } from './useActiveApps'

export type AppWithDefinition = {
  definition: AppDefinition
  app: AppBit
}

export function useActiveAppsWithDefinition(type?: string): AppWithDefinition[] {
  return useActiveApps(type).map(app => ({
    definition: getAppDefinition(app.identifier),
    app,
  }))
}
