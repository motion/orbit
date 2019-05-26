import { AppDefinition } from '@o/models'

export function createApp<T extends any>(app: AppDefinition<T>): AppDefinition<T> {
  return app
}
