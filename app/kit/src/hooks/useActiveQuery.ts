import { useReaction } from '@mcro/use-store'
import { useStoresSimple } from './useStores'

export function useActiveQuery() {
  const { appStore } = useStoresSimple()
  return useReaction(() => appStore.activeQuery) || ''
}
