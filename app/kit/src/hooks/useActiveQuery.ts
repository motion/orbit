import { useReaction } from '@mcro/use-store'
import { useStores } from './useStores'

export function useActiveQuery(): string {
  const { appStore } = useStores()
  return useReaction(() => appStore.activeQuery) || ''
}
