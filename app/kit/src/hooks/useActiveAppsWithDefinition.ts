import { AppBit } from '@mcro/models'
import { getAppDefinitions } from '../helpers/getAppDefinitions'
import { AppDefinition } from '../types/AppDefinition'
import { useActiveApps } from './useActiveApps'

// TODO when we unify apps + apps this will change
// essentially app definition + app instance
// for now its app definition + app instance

export type AppWithDefinition = {
  definition: AppDefinition
  app: AppBit
}

export function useActiveAppsWithDefinition(): AppWithDefinition[] {
  console.log(config.getApps())
  return useActiveApps().map(app => ({
    definition: getAppDefinitions().find(def => def.id === app.identifier),
    app,
  }))
}
