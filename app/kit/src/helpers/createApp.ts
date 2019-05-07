import { AppDefinition } from '../types/AppDefinition'

export function createApp<T extends any>(app: AppDefinition<T>): AppDefinition<T> {
  return app
}
