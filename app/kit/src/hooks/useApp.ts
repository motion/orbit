import { useReaction } from '@mcro/use-store'
import { useStores } from './useStores'

export function useApp(appId: string, id?: string) {
  const { appsStore } = useStores()
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
