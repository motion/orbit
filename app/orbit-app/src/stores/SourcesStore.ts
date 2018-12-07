import { SourceModel, Source, IntegrationType, AppConfig, AppType } from '@mcro/models'
import { observeMany } from '@mcro/model-bridge'
import { allIntegrations, getIntegrations } from '../sources'
import { react } from '@mcro/black'
import { OrbitIntegration, ResolvableModel } from '../sources/types'
import { keyBy } from 'lodash'

type GenericApp = OrbitIntegration<any> & {
  isActive: boolean
}

export const getAppFromSource = (source: Source): OrbitIntegration<any> => {
  return {
    ...getIntegrations[source.type](source),
    source,
  }
}

const modelTargetToAppType = (model: ResolvableModel): AppType => {
  if (model.target === 'person-bit') {
    return 'people'
  }
  if (model.target === 'search-group') {
    return 'search'
  }
  return model.target
}

export const sourceToAppConfig = (
  app: OrbitIntegration<any>,
  model?: ResolvableModel,
): AppConfig => {
  if (!app) {
    throw new Error(`No app given: ${JSON.stringify(app)}`)
  }
  return {
    id: `${(model && model.id) || (app.source && app.source.id) || Math.random()}`,
    icon: app.display.icon,
    iconLight: app.display.iconLight,
    title: app.display.name,
    type: modelTargetToAppType(model),
    integration: app.integration,
    viewConfig: app.viewConfig,
  }
}

export class SourcesStore {
  appSources: Source[] = []

  activeSources = react(
    () => this.appSources,
    appSources => {
      return appSources.filter(x => !!allIntegrations[x.type]).map(getAppFromSource)
    },
    {
      defaultValue: [],
    },
  )

  // this is every possible app (that uses a bit), just turned into array
  get sources(): OrbitIntegration<any>[] {
    return Object.keys(allIntegrations)
      .map(x => allIntegrations[x])
      .filter(x => x.modelType === 'bit')
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
      return () => `no source view found of type ${type}`
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
