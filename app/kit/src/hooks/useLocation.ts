import { useStores } from './useStores'

export function useLocation() {
  return useStores().locationStore
}
