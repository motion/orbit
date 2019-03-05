import { useReaction } from '@mcro/use-store'
import { AppStore } from '../stores'
import { useStoresSimple } from './useStores'

export function useIsAppActive(appStore?: AppStore) {
  const stores = useStoresSimple()
  return useReaction(() => (appStore || stores.appStore).isActive)
}
