import { sortBy } from 'lodash'
import { useMemo } from 'react'
import { fuzzyFilter } from '../helpers/fuzzyFilter'
import { groupByFirstLetter } from '../helpers/groupByFirstLetter'
import { UseFilterProps } from '../hooks/useFilter'

export function useFilteredList({ filterKey = 'name', ...props }: UseFilterProps<any>) {
  const search =
    props.searchable === false
      ? ''
      : props.removePrefix
      ? removePrefixIfExists(props.search || '', props.removePrefix)
      : props.search || ''

  // cache the sort before we do the rest
  let sortedItems = useMemo(
    () => (props.sortBy ? sortBy(props.items, props.sortBy) : props.items),
    [props.items, props.sortBy],
  )

  const filteredItems = props.search
    ? fuzzyFilter(search, sortedItems, { key: filterKey })
    : sortedItems

  const shouldGroup = (props.groupByLetter && filteredItems.length > props.groupMinimum) || 0
  const getGroupProps = shouldGroup && groupByFirstLetter(filterKey)

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
