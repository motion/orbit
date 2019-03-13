import { useReaction } from '@o/use-store'
import { useCallback } from 'react'
import { UseFilterProps, useMemoSort } from './useFilter'
import { useStoresSimple } from './useStores'

export function useActiveQueryFilter<A>(props: UseFilterProps<A>): A[] {
  const { appStore } = useStoresSimple()
  const activeQuery = useReaction(() => appStore.activeQuery)
  const sortBy = useCallback(props.sortBy, [])
  return useMemoSort({
    query: typeof props.query === 'string' ? props.query : activeQuery,
    ...props,
    // never update this because it should be pure
    sortBy,
  })
}
