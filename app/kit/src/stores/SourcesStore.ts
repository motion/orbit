import { observeMany } from '@mcro/bridge'
import { SourceModel, SourceType } from '@mcro/models'
import { react } from '@mcro/use-store'
import { keyBy } from 'lodash'
import { config } from '../configureKit'
import { getAppFromSource } from '../helpers/getAppConfig'
import { AppDefinition } from '../types/AppDefinition'

type GenericApp = AppDefinition & {
  isActive: boolean
}

export class SourcesStore {
  loadedSources = react(() => observeMany(SourceModel), {
    defaultValue: [],
  })

  activeSources = react(
    () => this.loadedSources,
    loadedSources => {
      return loadedSources.filter(x => !!config.sources.allSources[x.type]).map(getAppFromSource)
    },
    {
      defaultValue: [],
    },
  )

  // this is every possible app (that uses a bit), just turned into array
  get sources(): AppDefinition[] {
    return Object.keys(config.sources.allSources)
      .map(x => config.sources.allSources[x])
      .filter(x => x && x.modelType === 'bit')
  }

  // pass in a blank source so we can access the OrbitApp configs
  allSources = react(
    () => this.activeSources,
    activeApps => {
      return this.sources.map(
        app =>
          ({
            ...app,
            isActive: !!activeApps.find(x => x.sourceType === app.sync.sourceType),
          } as GenericApp),
      )
    },
    {
      defaultValue: [],
    },
  )

  allSourcesMap = react(() => this.allSources, x => keyBy(x, 'source'), {
    defaultValue: {},
  })

  getView = (type: SourceType, viewType: 'main' | 'source' | 'item' | 'setup' | 'setting') => {
    if (!this.allSourcesMap[type]) {
      return null
    }
    return this.allSourcesMap[type].views[viewType]
  }
}
