import { searchSingle } from '@o/fuzzy-search'
import { isDefined, selectDefined } from '@o/utils'
import { sortBy } from 'lodash'
import { useCallback, useEffect, useMemo, useRef } from 'react'

import { groupByFirstLetter } from '../helpers/groupByFirstLetter'
import { ListItemProps } from '../lists/ListItemViewProps'
import { useActiveSearchQuery } from '../Search'

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

  /** The properties on item to use for search filtering */
  filterKeys?: string[]

  /** Will remove the string from the front of your search, optionally, on filter */
  removePrefix?: string

  /** Group items using a function */
  groupBy?: (item: any) => string

  /** Group items by first letter */
  groupByLetter?: boolean

  /** Adds a minimum item length before grouping takes effect */
  groupMinimum?: number
}

export function useFilter(props: UseFilterProps<ListItemProps>) {
  const items = props.items || []
  const filterKeys = props.filterKeys || ['title']
  const initialQuery = useRef(true)
  const activeQuery = useActiveSearchQuery({
    disabled: isDefined(props.query) || !props.searchable,
  })
  const query = selectDefined(props.query, activeQuery)

  useEffect(() => {
    if (initialQuery.current) {
      initialQuery.current = false
      return
    }
    if (props.onQueryChange) {
      props.onQueryChange(query)
    }
  }, [query])

  const searchQuery =
    props.searchable === false
      ? ''
      : props.removePrefix
      ? removePrefixIfExists(query || '', props.removePrefix)
      : query || ''

  // FIRST SORT

  // memo per-items
  // dont update on changed sortBy function, this is a bit hacky but its so easy to de-opt
  // we need a generic way to warn on this, and potentially could just force them to use items/key to update
  const sortByFn = useCallback(props.sortBy, [])
  const sortedItems = useMemo(() => (props.sortBy ? sortBy(items, sortByFn) : items), [
    items,
    sortByFn,
  ])

  // TODO this could be a lot more flexible, also see nextapps.de search on github
  const searchIndex = useMemo(() => {
    if (props.searchable !== false) {
      return sortedItems.map(item => filterKeys.map(key => item[key]).join(' '))
    }
    return []
  }, [sortedItems, props.searchable, ...filterKeys])

  // THEN FILTER

  // memo per-query
  // TODO we could have the sort option by score done here,
  // just a conditional in this memo and have it use FuzzyFilter.search(,,{ sort: true })
  const filteredItems = useMemo(() => {
    if (!searchQuery) {
      return sortedItems
    }
    let next = []
    // filter in a loop so we can do disableFilter checks
    for (const [index, item] of sortedItems.entries()) {
      if (item.disableFilter) {
        next.push(item)
        continue
      }
      if (searchSingle(sortedItems[index], searchQuery, filterKeys)) {
        next.push(item)
      }
    }
    return next
  }, [sortedItems, searchIndex, searchQuery, ...filterKeys])

  const shouldGroup = filteredItems.length > (props.groupMinimum || 0)

  // handle groupByLetter boolean
  let getGroupProps = useCallback(
    (item: any, index: number, items: any[]) => {
      if (shouldGroup && props.groupBy) {
        if (props.groupByLetter && groupByFirstLetter(filterKeys[0])) {
          if (items[index - 1]) {
            const cur = props.groupBy(items[index - 1])
            const next = props.groupBy(item)
            if (next !== cur) {
              return {
                separator: next,
              }
            }
          } else {
            return {
              separator: props.groupBy(item),
            }
          }
        }
      }
    },
    [props.groupBy],
  )

  return {
    results: filteredItems,
    getItemProps: getGroupProps,
  }
}

export function removePrefixIfExists(text: string, prefix: string) {
  if (text[0] === prefix) {
    return text.slice(1)
  }
  return text
}
