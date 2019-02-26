import { config } from '../configureKit'
import { AppConfig } from '../types/AppConfig'
import { AppDefinition } from '../types/AppDefinition'
import { ResolvableModel } from '../types/ResolvableModel'
import { OrbitListItemProps } from '../views/ListItem'

export function getAppConfig(props: OrbitListItemProps, id?: string): AppConfig {
  const { item } = props
  if (item) {
    if (item.target === 'bit') {
      const appDef = config.getApps().find(x => x.id === item.appId)
      return getSourceAppConfig(appDef, item)
    }
    if (item.target === 'person-bit') {
      const appDef = config.getApps().find(x => x.id === 'people')
      return getSourceAppConfig(appDef, item)
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
    appId: props.appId,
    // dont accept react elements
    title: typeof props.title === 'string' ? props.title : undefined,
    icon: typeof props.icon === 'string' ? props.icon : undefined,
    subType: props.subType,
    subId: props.subId,
    ...props.appConfig,
  }
}

const modelTargetToAppType = (model: ResolvableModel) => {
  // todo(nate): check it
  // if (model.target === 'person-bit') {
  //   return 'people'
  // }
  if (model.target === 'search-group') {
    return 'search'
  }
  return model.target
}

export function getSourceAppConfig(appDef: AppDefinition, model: ResolvableModel): AppConfig {
  if (!appDef) {
    throw new Error(`No source given: ${JSON.stringify(appDef)}`)
  }
  return {
    id: `${model.id}`,
    icon: appDef.icon,
    iconLight: appDef.iconLight,
    title: model.target === 'bit' ? model.title : model['name'],
    appId: model ? modelTargetToAppType(model) : 'sources',
    viewConfig: appDef.defaultViewConfig,
  }
}
