import { SourceModel, Source, IntegrationType } from '@mcro/models'
import { observeMany } from '@mcro/model-bridge'
import { allIntegrations, getIntegrations } from '../integrations'
import { react } from '@mcro/black'
import { OrbitIntegration, ResolvableModel } from '../integrations/types'
import { keyBy } from 'lodash'
import { AppConfig } from '@mcro/stores'

type GenericApp = OrbitIntegration<any> & {
  isActive: boolean
}

export const getAppFromSource = (source: Source): OrbitIntegration<any> => {
  return {
    ...getIntegrations[source.type](source),
    source,
  }
}

export const getAppConfig = (model: ResolvableModel): AppConfig => {
  const type = model.target === 'bit' ? model.integration : 'person'
  const app = allIntegrations[type]
  if (!app) {
    console.log('no app', type, allIntegrations)
    return null
  }
  return appToAppConfig(app, model)
}

export const appToAppConfig = (app: OrbitIntegration<any>, model?: ResolvableModel): AppConfig => {
  if (!app) {
    throw new Error(`No app given: ${JSON.stringify(app)}`)
  }
  return {
    id: `${(model && model.id) || (app.source && app.source.id) || Math.random()}`,
    icon: app.display.icon,
    iconLight: app.display.iconLight,
    title: app.display.name,
    type: app.modelType,
    integration: app.integration,
    viewConfig: app.viewConfig,
  }
}

export class AppsStore {
  appSources: Source[] = []

  activeIntegrations = react(
    () => this.appSources,
    appSources => {
      return appSources.filter(x => !!allIntegrations[x.type]).map(getAppFromSource)
    },
    {
      defaultValue: [],
    },
  )

  // this is every possible app (that uses a bit), just turned into array
  get integrations(): OrbitIntegration<any>[] {
    return Object.keys(allIntegrations)
      .map(x => allIntegrations[x])
      .filter(x => x.source === 'bit')
  }

  // pass in a blank source so we can access the OrbitApp configs
  allIntegrations = react(
    () => this.activeIntegrations,
    activeApps => {
      return this.integrations.map(
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

  allIntegrationsMap = react(() => this.allIntegrations, x => keyBy(x, 'integration'), {
    defaultValue: {},
  })

  getView = (type: IntegrationType | 'person', viewType: 'main' | 'source' | 'item') => {
    if (!this.allIntegrationsMap[type]) {
      return () => 'none'
    }
    return this.allIntegrationsMap[type].views[viewType]
  }

  private appSources$ = observeMany(SourceModel).subscribe(values => {
    this.appSources = values
  })

  willUnmount() {
    this.appSources$.unsubscribe()
  }
}
