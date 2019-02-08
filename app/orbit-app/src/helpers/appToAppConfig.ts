import { AppBit } from '@mcro/models'
import { AppConfig, AppType } from '../apps/AppTypes'

export function appToAppConfig(app: AppBit): AppConfig {
  return {
    id: `${app.id}`,
    title: app.name,
    type: AppType[app.type],
  }
}
