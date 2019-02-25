import { useReaction } from '@mcro/use-store'
import { useStoresSimple } from './useStores'

export function useIsAppActive() {
  const { appStore } = useStoresSimple()
  return useReaction(() => {
    console.log('run reaction')
    return appStore.isActive
  })
}
