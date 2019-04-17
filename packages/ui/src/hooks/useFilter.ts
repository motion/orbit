import { useCallback } from 'react'
import { useFilteredList } from '../lists/useFilteredList'

export type UseFilterProps<A> = {
  searchable?: boolean
  items: A[]
  search?: string
  sortBy?: (item: A) => string
  filterKey?: string
  removePrefix?: string

  // TODO implement again
  groupByLetter?: boolean
  groupMinimum?: number
}

export function useFilter(props: UseFilterProps<any>) {
  const sortBy = useCallback(props.sortBy, [])
  return useFilteredList({
    ...props,
    // never update this because it should be pure
    sortBy,
  })
}
