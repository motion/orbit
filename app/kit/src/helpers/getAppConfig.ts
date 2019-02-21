import { config } from '../configureKit'
import { AppConfig } from '../types/AppConfig'
import { OrbitListItemProps } from '../views/ListItem'

export function getAppConfig(props: OrbitListItemProps, id?: string): AppConfig {
  return config.getAppConfig(props, id)
}
