import { useReaction } from '@mcro/use-store'
import { useStores } from './useStores'

export function useApp(appId: string, id?: string) {
  const { appsStore } = useStores()

  if (appsStore.hasLoaded) {
    if (!appsStore.allIds.find(x => x === appId)) {
      throw new Error(`No appId exists: ${appId}. Available: ${appsStore.allIds.join(', ')}`)
    }
  }

  const state = useReaction(() => appsStore.getApp(appId, id), [appId, id])
  const next = {
    views: {},
    appStore: null,
    definition: null,
    id,
    appId,
    provideStores: null,
    ...state,
  }
  return {
    ...next,
    views: next.views || {},
  }
}
