import { AppDefinition } from '@o/models'
import { useForceUpdate } from '@o/use-store'
import { useEffect } from 'react'

import { OrbitHot } from '../OrbitHot'
import { createApi } from './createApi'

let apps: AppDefinition[] = []
let updateListeners = new Set<Function>()

export function createApp<T extends any>(app: AppDefinition<T>): AppDefinition<T> {
  const appWrapped = setupApp(app)
  // remove old one first (HMR)
  if (apps.find(x => x.id === app.id)) {
    apps = apps.filter(x => x.id !== app.id)
  }
  apps.push(appWrapped)
  notifyAppsUpdated()
  return appWrapped
}

let updateTm = null
function notifyAppsUpdated() {
  // notify update listeners
  clearTimeout(updateTm)
  updateTm = setTimeout(() => {
    updateListeners.forEach(x => x(apps))
  })
}

export function getApps() {
  return apps
}

function setupApp(app: AppDefinition): AppDefinition {
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

export function useReloadAppDefinitions() {
  const forceUpdate = useForceUpdate()
  useEffect(() => {
    updateListeners.add(forceUpdate)
    return () => {
      updateListeners.delete(forceUpdate)
    }
  }, [])
}
