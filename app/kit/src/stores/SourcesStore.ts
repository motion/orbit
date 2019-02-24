import { observeMany } from '@mcro/bridge'
import { SourceModel } from '@mcro/models'
import { react } from '@mcro/use-store'
import { config } from '../configureKit'
import { AppDefinition } from '../types/AppDefinition'

type GenericApp = AppDefinition & {
  isActive: boolean
}

export class SourcesStore {
  loadedSources = react(() => observeMany(SourceModel), {
    defaultValue: [],
  })

  // this is every possible app (that uses a bit), just turned into array
  get sources(): AppDefinition[] {
    return Object.keys(config.sources.allSources)
      .map(x => config.sources.allSources[x])
      .filter(x => x && x.modelType === 'bit')
  }

  // pass in a blank source so we can access the OrbitApp configs
  allSources = react(
    () => this.loadedSources,
    activeApps => {
      return this.sources.map(
        app =>
          ({
            ...app,
            isActive: !!activeApps.find(x => x.type === app.sync.sourceType),
          } as GenericApp),
      )
    },
    {
      defaultValue: [],
    },
  )
}
