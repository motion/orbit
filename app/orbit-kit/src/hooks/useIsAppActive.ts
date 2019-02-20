import { useReaction } from '@mcro/use-store'
import { useStoresSimple } from '../helpers/useStores'

export function useIsAppActive(): string {
  const { appStore } = useStoresSimple()
  return useReaction(() => appStore.isActive)
}
