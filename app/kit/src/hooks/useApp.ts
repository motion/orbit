import { useReaction } from '@mcro/use-store'
import { useStores } from './useStores'

export function useApp(identifier: string, id?: string) {
  const { appsStore } = useStores()

  if (appsStore.hasLoaded) {
    if (!appsStore.allIds.find(x => x === identifier)) {
      throw new Error(
        `No identifier exists: ${identifier}. Available: ${appsStore.allIds.join(', ')}`,
      )
    }
  }

  const state = useReaction(() => appsStore.getApp(identifier, id), [identifier, id])
  const next = {
    views: {},
    appStore: null,
    definition: null,
    id,
    identifier,
    provideStores: null,
    ...state,
  }
  return {
    ...next,
    views: next.views || {},
  }
}
