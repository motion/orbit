import { AppDefinition } from '../types/AppDefinition'

export function createApp<T extends AppDefinition>(app: T): T {
  return app
}
