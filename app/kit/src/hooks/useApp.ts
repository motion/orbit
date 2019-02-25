import { useReaction } from '@mcro/use-store'
import { useStores } from './useStores'

export function useApp(appId: string, id?: string) {
  const { appsStore } = useStores()
  const state = useReaction(
    () => {
      console.log('now get', appId, id, appsStore.apps, appsStore.getApp(appId, id))
      return appsStore.getApp(appId, id)
    },
    [appId, id],
  )
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
