import { selectDefined } from '@o/utils'
import fuzzySort from 'fuzzysort'
import { sortBy } from 'lodash'
import { useCallback, useEffect, useMemo, useRef } from 'react'

import { groupByFirstLetter } from '../helpers/groupByFirstLetter'
import { UseFilterProps } from '../hooks/useFilter'
import { useSearch } from '../Search'
import { ListItemSimpleProps } from './ListItemSimple'

export function useFilteredList({
  // TODO multiple filter keys...
  // can be done once table filter merges with this
  filterKey = 'title',
  ...props
}: UseFilterProps<ListItemSimpleProps>) {
  const items = props.items || []
  const searchStore = useSearch()
  const initialQuery = useRef(true)

  const query = selectDefined(props.query, searchStore.query)

  useEffect(() => {
    if (initialQuery.current) {
      initialQuery.current = false
      return
    }
    if (props.onQueryChange) {
      props.onQueryChange(query)
    }
  }, [query])

  const search =
    props.searchable === false
      ? ''
      : props.removePrefix
      ? removePrefixIfExists(query || '', props.removePrefix)
      : query || ''

  // FIRST SORT

  // memo per-items
  const sortedItems = useMemo(() => (props.sortBy ? sortBy(items, props.sortBy) : items), [
    items,
    props.sortBy,
  ])
  const searchIndex = useMemo(() => {
    return items.map(item => item[filterKey])
  }, [sortedItems])

  // THEN FILTER

  // memo per-query
  const filteredItems = useMemo(() => {
    if (search) {
      let next = []
      // filter in a loop so we can do disableFilter checks
      for (const [index, item] of sortedItems.entries()) {
        if (item.disableFilter) {
          next.push(item)
          continue
        }
        const res = fuzzySort.single(search, searchIndex[index])
        if (res && res.score > -50) {
          next.push(item)
        }
      }
      return next
    } else {
      return sortedItems
    }
  }, [sortedItems, searchIndex, search])

  const shouldGroup = filteredItems.length > (props.groupMinimum || 0)

  // handle groupByLetter boolean
  let getGroupProps = shouldGroup && props.groupByLetter && groupByFirstLetter(filterKey)

  // handle groupBy function
  if (shouldGroup && props.groupBy) {
    getGroupProps = useCallback(
      (item: any, index: number, items: any[]) => {
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
      },
      [props.groupBy],
    )
  }

  return {
    results: filteredItems,
    getItemProps: shouldGroup ? getGroupProps : null,
  }
}

export function removePrefixIfExists(text: string, prefix: string) {
  if (text[0] === prefix) {
    return text.slice(1)
  }
  return text
}
