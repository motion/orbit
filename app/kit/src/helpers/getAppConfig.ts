import { Source } from '@mcro/models'
import { config } from '../configureKit'
import { AppConfig } from '../types/AppConfig'
import { AppType } from '../types/AppType'
import { ResolvableModel } from '../types/ResolvableModel'
import { OrbitIntegration } from '../types/SourceTypes'
import { OrbitListItemProps } from '../views/ListItem'

export function getAppConfig(props: OrbitListItemProps, id?: string): AppConfig {
  const { item } = props
  let type: string = ''
  if (item) {
    switch (item.target) {
      case 'bit':
        type = item.integration
        break
      case 'person-bit':
        type = 'person'
        break
    }
    if (type) {
      return getSourceAppConfig(props)
    }
  }
  return {
    id,
    ...listItemToAppConfig(props),
  }
}

function listItemToAppConfig(props: OrbitListItemProps): AppConfig {
  return {
    id: props.id,
    type: AppType[props.type],
    // dont accept react elements
    title: typeof props.title === 'string' ? props.title : undefined,
    icon: typeof props.icon === 'string' ? props.icon : undefined,
    subType: props.subType,
    ...props.appConfig,
  }
}

export const getAppFromSource = (source: Source): OrbitIntegration<any> => {
  return {
    ...config.sources.getIntegrations[source.type](source),
    source,
  }
}

export function getSourceAppConfig({ item }: OrbitListItemProps): AppConfig {
  if (item && item.type) {
    const app = config.sources.allIntegrations[item.type]
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
