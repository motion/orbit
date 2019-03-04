import { useReaction } from '@mcro/use-store'
import { useStores } from './useStores'

export function useLoadedApp(identifier: string, id?: string) {
  const { appsStore } = useStores()
  const state = useReaction(() => appsStore.getApp(identifier, id), [identifier, id])
  const next = {
    views: {},
    appStore: null,
    definition: null,
    id,
    identifier,
    context: null,
    version: 0,
    ...state,
  }
  return {
    ...next,
    views: next.views || {},
  }
}
