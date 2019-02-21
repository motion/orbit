import { AppConfig, AppType } from '@mcro/kit'
import { AppBit } from '@mcro/models'

export function appToAppConfig(app: AppBit): AppConfig {
  return {
    id: `${app.id}`,
    title: app.name,
    type: AppType[app.type],
  }
}
