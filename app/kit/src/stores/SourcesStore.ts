import { observeMany } from '@mcro/bridge'
import { Source, SourceModel, SourceType } from '@mcro/models'
import { react } from '@mcro/use-store'
import { keyBy } from 'lodash'
import { config } from '../configureKit'
import { getAppFromSource } from '../helpers/getAppConfig'
import { OrbitSource } from '../types/SourceTypes'

type GenericApp = OrbitSource<any> & {
  isActive: boolean
}

export class SourcesStore {
  appSources: Source[] = []

  activeSources = react(
    () => this.appSources,
    appSources => {
      return appSources.filter(x => !!config.sources.allSources[x.type]).map(getAppFromSource)
    },
    {
      defaultValue: [],
    },
  )

  // this is every possible app (that uses a bit), just turned into array
  get sources(): OrbitSource<any>[] {
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
            isActive: !!activeApps.find(x => x.source === app.source),
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

  private appSources$ = observeMany(SourceModel).subscribe(values => {
    this.appSources = values
  })

  willUnmount() {
    this.appSources$.unsubscribe()
  }
}
