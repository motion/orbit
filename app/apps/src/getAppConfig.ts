import {
  AppConfig,
  AppType,
  OrbitIntegration,
  OrbitListItemProps,
  ResolvableModel,
} from '@mcro/kit'
import { Source } from '@mcro/models'
import { allIntegrations, getIntegrations } from './apps'

// this is mid-refactor in a sense
// appConfig is a weird setup, its used basically to pass from a index over to a main view
// it should be able to "set up" the main view
// technically it could be anything you want, but earlier we had it a bit more typed/setup
// this is sort of an awkward function to take certain things we understand and produce appConfig
// but then it also falls back to generically mapping over ListItem props
// works for now, but could be rethought

export const getAppFromSource = (source: Source): OrbitIntegration<any> => {
  return {
    ...getIntegrations[source.type](source),
    source,
  }
}

export function getAppConfig({ item }: OrbitListItemProps): AppConfig {
  if (item && item.type) {
    const app = allIntegrations[item.type]
    return sourceToAppConfig(app, item)
  }
}

const modelTargetToAppType = (model: ResolvableModel): AppType => {
  if (model.target === 'person-bit') {
    return AppType.people
  }
  if (model.target === 'search-group') {
    return AppType.search
  }
  return AppType[model.target]
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
    type: model ? modelTargetToAppType(model) : AppType.sources,
    integration: app.integration,
    viewConfig: app.viewConfig,
  }
}
