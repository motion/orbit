import { useReaction } from '@o/use-store'
import { AppStore } from '../stores'
import { useStoresSimple } from './useStores'

export function useIsAppActive(appStore?: AppStore) {
  const stores = useStoresSimple()
  const store = appStore || stores.appStore
  return useReaction(() => (store ? store.isActive : false))
}
