import { selectDefined } from '@o/utils'
import { sortBy } from 'lodash'
import { useCallback, useMemo } from 'react'

import { fuzzyFilter } from '../helpers/fuzzyFilter'
import { groupByFirstLetter } from '../helpers/groupByFirstLetter'
import { UseFilterProps } from '../hooks/useFilter'
import { useSearch } from '../Search'

export function useFilteredList({ filterKey = 'title', ...props }: UseFilterProps<any>) {
  const items = props.items || []
  const searchStore = useSearch()

  const query = selectDefined(props.query, searchStore.query)

  const search =
    props.searchable === false
      ? ''
      : props.removePrefix
      ? removePrefixIfExists(query || '', props.removePrefix)
      : query || ''

  // cache the sort before we do the rest
  let sortedItems = useMemo(() => (props.sortBy ? sortBy(items, props.sortBy) : items), [
    items,
    props.sortBy,
  ])

  // handle search
  const filteredItems = query ? fuzzyFilter(search, sortedItems, { key: filterKey }) : sortedItems

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
