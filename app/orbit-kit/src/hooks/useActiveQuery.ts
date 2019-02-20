import { useReaction } from '@mcro/use-store'
import { useStores } from '../helpers/useStores'

export function useActiveQuery() {
  const { appStore } = useStores()
  return useReaction(() => {})
}
