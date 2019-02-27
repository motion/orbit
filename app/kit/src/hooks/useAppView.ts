import { config } from '../configureKit'

// only for static views, not ones that need loading/context

export function useAppView(appIdentifier: string, viewType: 'settings' | 'setup') {
  const def = config.getApps().find(x => x.id === appIdentifier)
  if (!def || !def[viewType]) {
    return null
  }
  return def[viewType]
}
