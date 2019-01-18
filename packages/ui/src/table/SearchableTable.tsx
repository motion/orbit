/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import * as React from 'react'
import deepEqual from 'react-fast-compare'
import textContent from '../helpers/textContent'
import { ManagedTable, ManagedTableProps } from './ManagedTable'
import { Searchable, SearchableProps } from './Searchable'
import { Filter, TableBodyRow } from './types'

type Props = ManagedTableProps &
  SearchableProps & {
    defaultFilters: Filter[]
    filter: any
    filterValue: any
  }

type State = {
  filterRows: (row: TableBodyRow) => boolean
  filters: Filter[]
  searchTerm: string
}

const filterRowsFactory = (filters: Filter[], searchTerm: string) => (row: TableBodyRow): boolean =>
  filters
    .map((filter: Filter) => {
      if (filter.type === 'enum' && row.type != null) {
        // @ts-ignore
        return filter.value.length === 0 || filter.value.indexOf(row.type) > -1
      } else if (filter.type === 'include') {
        return (
          textContent(row.columns[filter.key].value).toLowerCase() === filter.value.toLowerCase()
        )
      } else if (filter.type === 'exclude') {
        return (
          textContent(row.columns[filter.key].value).toLowerCase() !== filter.value.toLowerCase()
        )
      } else {
        return true
      }
    })
    .reduce((acc, cv) => acc && cv, true) &&
  (searchTerm != null && searchTerm.length > 0
    ? Object.keys(row.columns)
        .map(key => textContent(row.columns[key].value))
        .join('~~') // prevent from matching text spanning multiple columns
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    : true)

class SearchableManagedTable extends React.PureComponent<Props, State> {
  static defaultProps = {
    defaultFilters: [],
  }

  state = {
    filterRows: filterRowsFactory(this.props.filters, this.props.searchTerm),
    filters: null,
    searchTerm: '',
  }

  componentDidMount() {
    this.props.defaultFilters.map(this.props.addFilter)
  }

  static getDerivedStateFromProps(props, state) {
    if (props.searchTerm !== state.searchTerm || !deepEqual(state.filters, props.filters)) {
      return {
        filterRows: filterRowsFactory(props.filters, props.searchTerm),
        searchTerm: props.searchTerm,
        filters: props.filters,
      }
    }
    return null
  }

  render() {
    const { addFilter, searchTerm: _searchTerm, filters: _filters, ...props } = this.props
    return <ManagedTable {...props} filter={this.state.filterRows} onAddFilter={addFilter} />
  }
}

export const SearchableTable = props => (
  <Searchable {...props}>
    {({ searchBar, ...rest }) => (
      <>
        {searchBar}
        <SearchableManagedTable {...props} {...rest} />
      </>
    )}
  </Searchable>
)
