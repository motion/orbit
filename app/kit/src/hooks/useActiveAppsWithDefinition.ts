import { AppBit } from '@mcro/models'
import { config } from '../configureKit'
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
  return useActiveApps().map(app => ({
    definition: config.getApps().find(def => def.id === app.identifier),
    app,
  }))
}
