import { AppDefinition } from '../types/AppTypes'

export function createApp<T extends any>(app: AppDefinition<T>): AppDefinition<T> {
  return app
}
