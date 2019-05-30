import { useCallback } from 'react'

import { useFilteredList } from '../lists/useFilteredList'

export type UseFilterProps<A> = {
  /** Toggle to enable/disable search filtering */
  searchable?: boolean

  /** Items for filtering */
  items: A[]

  /** String for filtering items */
  query?: string

  /** Callback for when query changes */
  onQueryChange?: (next: string) => any

  /** Function to determine sort order of items, should return a string determining sort order */
  sortBy?: (item: A) => string

  /** The property on item to use for search filtering */
  filterKey?: string

  /** Will remove the string from the front of your search, optionally, on filter */
  removePrefix?: string

  /** Group items using a function */
  groupBy?: (item: any) => string

  /** Group items by first letter */
  groupByLetter?: boolean

  /** Adds a minimum item length before grouping takes effect */
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
