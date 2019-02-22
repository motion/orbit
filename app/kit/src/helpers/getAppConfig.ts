import { config } from '../configureKit'
import { AppConfig } from '../types/AppConfig'
import { AppType } from '../types/AppType'
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
    if (type && config.getAppConfig) {
      return config.getAppConfig(props, id)
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
