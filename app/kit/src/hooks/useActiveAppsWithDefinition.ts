import { AppBit } from '@o/models'
import { getAppDefinitions } from '../helpers/getAppDefinitions'
import { AppDefinition } from '../types/AppDefinition'
import { useActiveAppsSorted } from './useActiveAppsSorted'

// TODO when we unify apps + apps this will change
// essentially app definition + app instance
// for now its app definition + app instance

export type AppWithDefinition = {
  definition: AppDefinition
  app: AppBit
}

export function useActiveAppsWithDefinition(): AppWithDefinition[] {
  return useActiveAppsSorted().map(app => ({
    definition: getAppDefinitions().find(def => def.id === app.identifier),
    app,
  }))
}
