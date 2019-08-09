import { AppDefinition } from '@o/models'

import { createAppHotHandler } from '../createHotHandler'
import { createApi } from './createApi'

export function createApp<T extends any>(app: AppDefinition<T>): AppDefinition<T> {
  if (createAppHotHandler && app.app) {
    createAppHotHandler(app.app)
  }
  if (typeof window !== 'undefined' && Object.keys(app).some(x => x === 'api')) {
    return {
      ...app,
      api: createApi(null),
    }
  }
  return app
}
