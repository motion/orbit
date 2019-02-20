import { useReaction } from '@mcro/use-store'
import { useStores } from '../helpers/useStores'

export function useActiveQuery(): string {
  const { appStore } = useStores()
  return useReaction(() => appStore.activeQuery)
}
