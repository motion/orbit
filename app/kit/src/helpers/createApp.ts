import { AppDefinition } from '@o/models'

import { createApi } from './createApi'

// hotHandler, see createHotHandler
let hotHandler = null

export function createApp<T extends any>(app: AppDefinition<T>): AppDefinition<T> {
  if (typeof window !== 'undefined' && Object.keys(app).some(x => x === 'api')) {
    if (hotHandler) {
      hotHandler(app)
    }
    return {
      ...app,
      api: createApi(null),
    }
  }
  return app
}

export function setCreateAppHotHandler(handler: ((app: AppDefinition) => void) | null) {
  hotHandler = handler
}
