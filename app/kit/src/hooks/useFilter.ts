import { sortBy } from 'lodash'
import { useMemo } from 'react'
import { fuzzyFilter } from '../helpers/fuzzyFilter'

export type UseFilterProps<A> = {
  items: A[]
  query?: string
  filterKey?: string
  sortBy?: (item: A) => string
  removePrefix?: string
  groupByLetter?: boolean
  groupMinimum?: number
}

export function useFilter({ filterKey = 'id', groupMinimum, ...props }: UseFilterProps<any>) {
  const query = props.removePrefix
    ? removePrefixIfExists(props.query || '', props.removePrefix)
    : props.query || ''

  // cache the sort before we do the rest
  let items = useMemo(() => (props.sortBy ? sortBy(props.items, props.sortBy) : props.items), [
    props.items,
    props.sortBy,
  ])

  return props.query ? fuzzyFilter(query, items, { key: filterKey }) : items
}

export function removePrefixIfExists(text: string, prefix: string) {
  if (text[0] === prefix) {
    return text.slice(1)
  }
  return text
}
