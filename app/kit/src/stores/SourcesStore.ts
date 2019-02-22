import { observeMany } from '@mcro/bridge'
import { IntegrationType, Source, SourceModel } from '@mcro/models'
import { react } from '@mcro/use-store'
import { keyBy } from 'lodash'
import { config } from '../configureKit'
import { getAppFromSource } from '../helpers/getAppConfig'
import { OrbitIntegration } from '../types/SourceTypes'

type GenericApp = OrbitIntegration<any> & {
  isActive: boolean
}

export class SourcesStore {
  appSources: Source[] = []

  activeSources = react(
    () => this.appSources,
    appSources => {
      return appSources.filter(x => !!config.sources.allIntegrations[x.type]).map(getAppFromSource)
    },
    {
      defaultValue: [],
    },
  )

  // this is every possible app (that uses a bit), just turned into array
  get sources(): OrbitIntegration<any>[] {
    return Object.keys(config.sources.allIntegrations)
      .map(x => config.sources.allIntegrations[x])
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
            isActive: !!activeApps.find(x => x.integration === app.integration),
          } as GenericApp),
      )
    },
    {
      defaultValue: [],
    },
  )

  allSourcesMap = react(() => this.allSources, x => keyBy(x, 'integration'), {
    defaultValue: {},
  })

  getView = (type: IntegrationType, viewType: 'main' | 'source' | 'item' | 'setup' | 'setting') => {
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
