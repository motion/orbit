import { AppDefinition } from '@o/models'

import { OrbitHot } from '../OrbitHot'
import { createApi } from './createApi'

export function createApp<T extends any>(app: AppDefinition<T>): AppDefinition<T> {
  const hotHandler = OrbitHot.getCurrentHandler()
  if (hotHandler && app.app) {
    app.app = hotHandler(app.app)
  }
  if (typeof window !== 'undefined' && Object.keys(app).some(x => x === 'api')) {
    return {
      ...app,
      api: createApi(null),
    }
  }
  return app
}
