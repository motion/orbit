import { sortBy } from 'lodash'
import { useMemo } from 'react'
import { fuzzyQueryFilter } from '../../helpers'
import { removePrefixIfExists } from '../../helpers/removePrefixIfExists'

export type FilterableProps<A> = {
  items: A[]
  query?: string
  filterKey?: string
  sortBy?: (item: A) => string
  removePrefix?: string
  groupByLetter?: boolean
  groupMinimum?: number
}

export function useFilterableResults({
  filterKey = 'id',
  groupMinimum,
  ...props
}: FilterableProps<any>) {
  const query = props.removePrefix
    ? removePrefixIfExists(props.query || '', props.removePrefix)
    : props.query || ''

  // cache the sort before we do the rest
  let items = useMemo(() => (props.sortBy ? sortBy(props.items, props.sortBy) : props.items), [
    props.items,
    props.sortBy,
  ])

  return props.query ? fuzzyQueryFilter(query, items, { key: filterKey }) : items
}
