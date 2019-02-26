import { Source } from '@mcro/models'
import { config } from '../configureKit'
import { AppDefinition } from '../types/AppDefinition'
import { useActiveSources } from './useActiveSources'

// TODO when we unify apps + sources this will change
// essentially app definition + app instance
// for now its app definition + source instance

export type AppWithSource = {
  definition: AppDefinition
  source: Source
}

export function useActiveSourcesWithDefinition(): AppWithSource[] {
  return useActiveSources().map(source => ({
    definition: config.getApps().find(app => app.id === source.appId),
    source,
  }))
}
