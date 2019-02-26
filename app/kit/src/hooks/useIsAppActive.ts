import { useReaction } from '@mcro/use-store'
import { useStoresSimple } from './useStores'

export function useIsAppActive() {
  const { appStore } = useStoresSimple()
  return useReaction(() => appStore.isActive)
}
