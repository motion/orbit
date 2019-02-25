import { useStores } from './useStores'

export function useApp(appId: string, id?: string) {
  const { appsStore } = useStores()
  const state = appsStore.getApp(appId, id)
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
