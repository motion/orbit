import { App, AppConfig, AppType } from '@mcro/models'

export function appToAppConfig(app: App): AppConfig {
  return {
    id: `${app.id}`,
    title: app.name,
    type: AppType[app.type],
  }
}
