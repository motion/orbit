import { useCallback } from 'react'
import { useActiveQuery } from './useActiveQuery'
import { UseFilterProps, useMemoSort } from './useFilter'

export function useActiveQueryFilter<A>(props: UseFilterProps<A>): A[] {
  const activeQuery = useActiveQuery()
  const sortBy = useCallback(props.sortBy, [])
  const query = typeof props.query === 'string' ? props.query : activeQuery
  return useMemoSort({
    ...props,
    query,
    // never update this because it should be pure
    sortBy,
  })
}
