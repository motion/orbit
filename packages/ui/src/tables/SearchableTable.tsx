/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import { isEqual } from '@o/fast-compare'
import { View } from '@o/gloss'
import * as React from 'react'
import textContent from '../helpers/textContent'
import { GenericDataRow } from '../types'
import { ManagedTable, ManagedTableProps } from './ManagedTable'
import { Searchable, SearchableProps } from './Searchable'
import { TableFilter } from './types'

export type SearchableTableProps = ManagedTableProps &
  Partial<SearchableProps> & {
    searchable?: boolean
    defaultFilters?: TableFilter[]
    filter?: any
    filterValue?: any
  }

type State = {
  filterRows: (row: GenericDataRow) => boolean
  filters: TableFilter[]
  searchTerm?: string
}

const filterRowsFactory = (filters: TableFilter[], searchTerm: string) => (
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

class SearchableManagedTable extends React.PureComponent<SearchableTableProps, State> {
  state = {
    filterRows: null,
    filters: null,
    searchTerm: '',
  }

  componentDidMount() {
    if (this.props.defaultFilters) {
      this.props.defaultFilters.map(this.props.addFilter)
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.searchTerm !== state.searchTerm || !isEqual(state.filters, props.filters)) {
      return {
        filterRows: filterRowsFactory(props.filters || [], props.searchTerm),
        filters: props.filters,
        searchTerm: props.searchTerm,
      }
    }
    return null
  }

  render() {
    const { addFilter, searchTerm: _searchTerm, filters: _filters, ...props } = this.props
    return <ManagedTable {...props} filter={this.state.filterRows} onAddFilter={addFilter} />
  }
}

export const SearchableTable = (props: SearchableTableProps) => {
  if (!props.searchable) {
    return <SearchableManagedTable {...props} />
  }
  return (
    <Searchable {...props}>
      {({ searchBar, ...rest }) => (
        <>
          <View padding={5}>{searchBar}</View>
          <SearchableManagedTable {...props} {...rest} />
        </>
      )}
    </Searchable>
  )
}
