import { AppConfig } from '@o/kit'
import { AppBit } from '@o/models'

export function appToAppConfig(app: AppBit): AppConfig {
  return {
    id: `${app.id}`,
    title: app.name,
    identifier: app.identifier,
  }
}
