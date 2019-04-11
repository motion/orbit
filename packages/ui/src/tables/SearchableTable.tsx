/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import { isEqual } from '@o/fast-compare'
import * as React from 'react'
import { FilterableProps, filterRowsFactory } from '../Filterable'
import { GenericDataRow } from '../types'
import { View } from '../View/View'
import { ManagedTable, ManagedTableProps } from './ManagedTable'
import { Searchable, SearchableProps } from './Searchable'
import { TableFilter } from './types'

export type SearchableTableProps = ManagedTableProps &
  FilterableProps &
  Partial<SearchableProps> & {
    searchable?: boolean
  }

type State = {
  filterRows: (row: GenericDataRow) => boolean
  filters: TableFilter[]
  searchTerm?: string
}

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
    const { addFilter, searchTerm, filters, ...props } = this.props
    // unused
    searchTerm
    filters
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
