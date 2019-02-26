import { config } from '../configureKit'

// only for static views, not ones that need loading/context

export function useAppView(appId: string, viewType: 'settings' | 'setup') {
  const def = config.getApps().find(x => x.id === appId)
  if (!def || !def.sync || !def.sync[viewType]) {
    return null
  }
  return def.sync[viewType]
}
