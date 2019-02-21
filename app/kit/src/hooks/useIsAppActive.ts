import { useReaction } from '@mcro/use-store'
import { useStoresSimple } from '../helpers/useStores'

export function useIsAppActive() {
  const { appStore } = useStoresSimple()
  return useReaction(() => appStore.isActive)
}
