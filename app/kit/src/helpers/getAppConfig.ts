import { loadOne } from '@mcro/bridge'
import { Source, SourceModel, SourceType } from '@mcro/models'
import { config } from '../configureKit'
import { AppConfig } from '../types/AppConfig'
import { AppType } from '../types/AppType'
import { ResolvableModel } from '../types/ResolvableModel'
import { OrbitSource } from '../types/SourceTypes'
import { OrbitListItemProps } from '../views/ListItem'

export async function getAppConfig(props: OrbitListItemProps, id?: string): Promise<AppConfig> {
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

export const getAppFromSource = (source: Source): OrbitSource => {
  return config.sources.getSources[source.type](source)
}

export async function getSourceAppConfig({ item }: OrbitListItemProps): Promise<AppConfig> {
  if (item && item.type) {
    return sourceToAppConfig(config.sources.allSources[item.type], item)
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

export async function sourceToAppConfig(
  sourceConfig: OrbitSource,
  model?: ResolvableModel,
): Promise<AppConfig> {
  if (!sourceConfig) {
    throw new Error(`No source given: ${JSON.stringify(sourceConfig)}`)
  }
  let source = null
  if (model.target === 'bit') {
    source = await loadOne(SourceModel, { args: { where: { id: model.sourceId } } })
  }
  return {
    id: `${(model && model.id) || (source && source.id) || Math.random()}`,
    icon: sourceConfig.icon,
    iconLight: sourceConfig.iconLight,
    title: source.name,
    type: model ? modelTargetToAppType(model) : AppType.sources,
    source: sourceConfig.sourceType as SourceType,
    viewConfig: sourceConfig.viewConfig,
  }

  console.warn('person needs to switch to bit...')
  return {}
}
