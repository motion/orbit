import { Source } from '@mcro/models';
import { config } from '../configureKit';
import { AppConfig } from '../types/AppConfig';
import { AppType } from '../types/AppType';
import { ResolvableModel } from '../types/ResolvableModel';
import { OrbitSource } from '../types/SourceTypes';
import { OrbitListItemProps } from '../views/ListItem';

export function getAppConfig(props: OrbitListItemProps, id?: string): AppConfig {
  const { item } = props
  let type: string = ''
  if (item) {
    switch (item.target) {
      case 'bit':
        type = item.source
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

export const getAppFromSource = (source: Source): OrbitSource<any> => {
  return config.sources.getSources[source.type](source)
}

export function getSourceAppConfig({ item }: OrbitListItemProps): AppConfig {
  if (item && item.type) {
    const app = config.sources.allSources[item.type]
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
  app: OrbitSource<any>,
  model?: ResolvableModel,
): AppConfig => {
  if (!app) {
    throw new Error(`No app given: ${JSON.stringify(app)}`)
  }
  return {
    id: `${(model && model.id) || (app.source && app.source.id) || Math.random()}`,
    icon: app.icon,
    iconLight: app.iconLight,
    title: app.name,
    type: model ? modelTargetToAppType(model) : AppType.sources,
    source: app.source,
    viewConfig: app.viewConfig,
  }
}
