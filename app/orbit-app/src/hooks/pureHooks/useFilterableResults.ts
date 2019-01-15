import { fuzzyQueryFilter } from '../../helpers'
import { sortBy } from 'lodash'
import { groupByFirstLetter } from '../../helpers/groupByFirstLetter'
import { removePrefixIfExists } from '../../helpers/removePrefixIfExists'

export type FilterableProps<A> = {
  items: A[]
  query?: string
  filterKey?: string
  sortBy?: (item: A) => string
  removePrefix?: string
  groupByLetter?: boolean
}

export function useFilterableResults(props: FilterableProps<any>) {
  const query = props.removePrefix
    ? removePrefixIfExists(props.query || '', props.removePrefix)
    : props.query || ''
  const filtered = fuzzyQueryFilter(query, props.items, { key: props.filterKey })
  const sorted = props.sortBy ? sortBy(filtered, props.sortBy) : filtered
  const grouped = props.groupByLetter ? groupByFirstLetter(sorted) : sorted
  return grouped
}
