import { useCallback } from 'react'
import { useActiveQuery } from './useActiveQuery'
import { useFilteredList, UseFilterProps } from './useFilteredList'

export function useActiveQueryFilter(props: UseFilterProps<any>) {
  const activeQuery = useActiveQuery()
  const sortBy = useCallback(props.sortBy, [])
  const query = typeof props.query === 'string' ? props.query : activeQuery
  return useFilteredList({
    ...props,
    query,
    // never update this because it should be pure
    sortBy,
  })
}
