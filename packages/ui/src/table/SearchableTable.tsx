/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import * as React from 'react'
import { Filter } from './types'
import { TableBodyRow } from './types'
import { ManagedTable, ManagedTableProps } from './ManagedTable'
import { Searchable, SearchableProps } from './Searchable'
import textContent from '../helpers/textContent'
import deepEqual from 'react-fast-compare'

type Props = ManagedTableProps &
  SearchableProps & {
    innerRef?: (ref: any) => void
    defaultFilters: Array<Filter>
    filter: any
    filterValue: any
  }

type State = {
  filterRows: (row: TableBodyRow) => boolean
}

const filterRowsFactory = (filters: Array<Filter>, searchTerm: string) => (
  row: TableBodyRow,
): boolean =>
  filters
    .map((filter: Filter) => {
      if (filter.type === 'enum' && row.type != null) {
        return filter.value.length === 0 || filter.value.indexOf(row.type) > -1
      } else if (filter.type === 'include') {
        return (
          textContent(row.columns[filter.key].value).toLowerCase() ===
          filter.value.toLowerCase()
        )
      } else if (filter.type === 'exclude') {
        return (
          textContent(row.columns[filter.key].value).toLowerCase() !==
          filter.value.toLowerCase()
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

class SearchableManagedTable extends React.PureComponent<Props> {
  static defaultProps = {
    defaultFilters: [],
  }

  state: State = {
    filterRows: filterRowsFactory(this.props.filters, this.props.searchTerm),
  }

  componentDidMount() {
    this.props.defaultFilters.map(this.props.addFilter)
  }

  componentWillReceiveProps(nextProps: Props) {
    // ManagedTable is a PureComponent and does not update when this.filterRows
    // would return a different value. This is why we update the funtion reference
    // once the results of the function changed.
    if (
      nextProps.searchTerm !== this.props.searchTerm ||
      !deepEqual(this.props.filters, nextProps.filters)
    ) {
      this.setState({
        filterRows: filterRowsFactory(nextProps.filters, nextProps.searchTerm),
      })
    }
  }

  render() {
    const {
      addFilter,
      searchTerm: _searchTerm,
      filters: _filters,
      innerRef,
      ...props
    } = this.props
    return (
      <ManagedTable
        {...props}
        filter={this.state.filterRows}
        onAddFilter={addFilter}
        ref={innerRef}
      />
    )
  }
}

export const SearchableTable = Searchable(SearchableManagedTable)
