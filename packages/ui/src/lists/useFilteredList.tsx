import { sortBy } from 'lodash'
import { useCallback, useMemo } from 'react'

import { fuzzyFilter } from '../helpers/fuzzyFilter'
import { groupByFirstLetter } from '../helpers/groupByFirstLetter'
import { UseFilterProps } from '../hooks/useFilter'

export function useFilteredList({ filterKey = 'title', ...props }: UseFilterProps<any>) {
  const items = props.items || []
  const search =
    props.searchable === false
      ? ''
      : props.removePrefix
      ? removePrefixIfExists(props.search || '', props.removePrefix)
      : props.search || ''

  // cache the sort before we do the rest
  let sortedItems = useMemo(() => (props.sortBy ? sortBy(items, props.sortBy) : items), [
    items,
    props.sortBy,
  ])

  // handle search
  const filteredItems = props.search
    ? fuzzyFilter(search, sortedItems, { key: filterKey })
    : sortedItems

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
