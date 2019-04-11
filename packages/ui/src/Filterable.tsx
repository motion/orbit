import textContent from './helpers/textContent'
import { TableFilter, TableRows } from './tables/types'
import { GenericDataRow } from './types'

// TODO

// this is now mid-migration to unify with lists
// we have some duplicate logic in places

// usage now is in SearchableTable/ManagedTable/Searchable
// we want to integrate that into Lists and also clean it up a bit

// Steps:

//   1. Understand Searchable/ManagedTable/SearchableTable
//   2. Understand differences in Lists (see useQueryFilter)
//   3. Add FilterableProps to Lists, modify them in ways that work for both
//   4. Possibly remove Searchable or simplify it in some way
//   5. Remove duplicate filtering functionality in Lists

export type FilterableProps = {
  /**
   * Value to filter rows on. Alternative to the `filter` prop.
   */
  filterValue?: string
  /**
   * Callback to filter rows.
   */
  filter?: (row: GenericDataRow) => boolean
  /**
   * Initial filters (uncontrolled).
   */
  defaultFilters?: TableFilter[]
}

export const filterRowsFactory = (filters: TableFilter[], searchTerm: string) => (
  row: GenericDataRow,
): boolean =>
  filters
    .map((filter: TableFilter) => {
      if (filter.type === 'enum' && row.category != null) {
        return filter.value.length === 0 || filter.value.indexOf(row.category) > -1
      } else if (filter.type === 'include') {
        return textContent(row.values[filter.key]).toLowerCase() === filter.value.toLowerCase()
      } else if (filter.type === 'exclude') {
        return (
          textContent(row.values[filter.key].value).toLowerCase() !== filter.value.toLowerCase()
        )
      } else {
        return true
      }
    })
    .reduce((acc, cv) => acc && cv, true) &&
  (searchTerm != null && searchTerm.length > 0
    ? Object.keys(row.values)
        .map(key => textContent(row.values[key]))
        .join('~~') // prevent from matching text spanning multiple columns
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    : true)

export const filterRows = (
  rows: TableRows,
  filterValue?: string,
  filter?: (row: GenericDataRow) => boolean,
): TableRows => {
  // check that we don't have a filter
  const hasFilterValue = filterValue !== '' && filterValue != null
  const hasFilter = hasFilterValue || typeof filter === 'function'
  if (!hasFilter) {
    return rows
  }
  let filteredRows = []
  if (hasFilter) {
    for (const row of rows) {
      let keep = false

      // check if this row's filterValue contains the current filter
      if (filterValue != null && !!row.filterValue) {
        keep = row.filterValue.includes(filterValue)
      }

      // call filter() prop
      if (keep === false && typeof filter === 'function') {
        keep = filter(row)
      }

      if (keep) {
        filteredRows.push(row)
      }
    }
  } else {
    filteredRows = rows
  }
  return filteredRows
}
