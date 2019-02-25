import { useReaction } from '@mcro/use-store'
import { useStoresSimple } from './useStores'

export function useApp(appId: string, id?: string) {
  const { appsStore } = useStoresSimple()
  const state = useReaction(() => appsStore.getApp(appId, id))
  if (!state) console.warn('no state', appId, id)
  return (
    state || {
      views: {},
      appStore: null,
      definition: null,
      id,
      appId,
      provideStores: null,
    }
  )
}
