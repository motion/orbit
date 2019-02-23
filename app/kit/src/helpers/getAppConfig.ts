import { loadOne } from '@mcro/bridge'
import { SourceModel, SourceType } from '@mcro/models'
import { config } from '../configureKit'
import { AppConfig } from '../types/AppConfig'
import { AppDefinition } from '../types/AppDefinition'
import { AppType } from '../types/AppType'
import { ResolvableModel } from '../types/ResolvableModel'
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
    appId: AppType[props.type],
    // dont accept react elements
    title: typeof props.title === 'string' ? props.title : undefined,
    icon: typeof props.icon === 'string' ? props.icon : undefined,
    subType: props.subType,
    ...props.appConfig,
  }
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
  appDef: AppDefinition,
  model?: ResolvableModel,
): Promise<AppConfig> {
  if (!appDef) {
    throw new Error(`No source given: ${JSON.stringify(appDef)}`)
  }
  let source = null
  if (model.target === 'bit') {
    source = await loadOne(SourceModel, { args: { where: { id: model.sourceId } } })
  }
  return {
    id: `${(model && model.id) || (source && source.id) || Math.random()}`,
    icon: appDef.icon,
    iconLight: appDef.iconLight,
    title: source.name,
    appId: model ? modelTargetToAppType(model) : AppType.sources,
    source: appDef.sync.sourceType as SourceType,
    viewConfig: appDef.defaultViewConfig,
  }

  console.warn('person needs to switch to bit...')
  return {}
}
