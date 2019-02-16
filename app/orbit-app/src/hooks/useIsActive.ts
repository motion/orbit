import { useStores } from './useStores'

export function useIsActive() {
  const { appStore } = useStores()
  return appStore.isActive
}
