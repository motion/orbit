import { config } from '../configureKit'

// only for static views, not ones that need loading/context

export function useAppView(appId: string, viewType: 'settings' | 'setup') {
  const def = config.getApps().find(x => x.id === appId)
  if (!def) {
    throw new Error(`No definition found for ${appId}`)
  }
  if (!def.sync || !def.sync[viewType]) {
    throw new Error(`No views found on definition for ${appId} ${viewType}`)
  }
  return def.sync[viewType]
}
