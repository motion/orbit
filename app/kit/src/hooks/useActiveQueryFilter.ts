import { useCallback } from 'react'
import { useActiveQuery } from './useActiveQuery'
import { useFilteredList, UseFilterProps } from './useFilteredList'

export function useActiveQueryFilter(props: UseFilterProps<any>) {
  const activeQuery = useActiveQuery()
  const sortBy = useCallback(props.sortBy, [])
  const search = typeof props.search === 'string' ? props.search : activeQuery
  return useFilteredList({
    ...props,
    search,
    // never update this because it should be pure
    sortBy,
  })
}
