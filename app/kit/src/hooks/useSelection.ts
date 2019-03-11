import { useStores } from './useStores'

export function useSelection() {
  return useStores().selectionStore
}
