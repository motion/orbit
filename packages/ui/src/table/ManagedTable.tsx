/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import * as React from 'react'
import {
  TableColumnRawOrder,
  TableColumnOrder,
  TableColumnSizes,
  TableColumns,
  TableHighlightedRows,
  TableRowSortOrder,
  TableRows,
  TableBodyRow,
  TableOnAddFilter,
} from './types'
import Table from './Table'
import { isEqual } from '@mcro/black'

export type ManagedTableProps = {
  bodyPlaceholder?: any
  /**
   * Column definitions.
   */
  columns: TableColumns
  /**
   * Row definitions.
   */
  rows: TableRows
  /**
   * Whether to use a virtual list. Items visible in the viewport are the only
   * included in the DOM. This can have a noticable performance improvement.
   */
  virtual?: boolean
  /**
   * Whether the table has a border.
   */
  floating?: boolean
  /**
   * Whether a row can span over multiple lines. Otherwise lines cannot wrap and
   * are truncated.
   */
  multiline?: boolean
  /**
   * Whether the body is scrollable. When this is set to `true` then the table
   * is not scrollable.
   */
  autoHeight?: boolean
  /**
   * Order of columns.
   */
  columnOrder?: TableColumnRawOrder
  /**
   * Size of the columns.
   */
  columnSizes?: TableColumnSizes
  /**
   * Value to filter rows on. Alternative to the `filter` prop.
   */
  filterValue?: string
  /**
   * Callback to filter rows.
   */
  filter?: (row: TableBodyRow) => boolean
  /**
   * Callback when the highlighted rows change.
   */
  onRowHighlighted?: (keys: TableHighlightedRows) => void
  /**
   * Whether rows can be highlighted or not.
   */
  highlightableRows?: boolean
  /**
   * Whether multiple rows can be highlighted or not.
   */
  multiHighlight?: boolean
  /**
   * Height of each row.
   */
  rowLineHeight?: number
  /**
   * This makes it so the scroll position sticks to the bottom of the window.
   * Useful for streaming data like requests, logs etc.
   */
  stickyBottom?: boolean
  /**
   * Used by SearchableTable to add filters for rows
   */
  onAddFilter?: TableOnAddFilter
  /**
   * Enable or disable zebra striping
   */
  zebra?: boolean
  /**
   * Whether to hide the column names at the top of the table.
   */
  hideHeader?: boolean

  // allow these to be managed from above
  sortOrder: TableRowSortOrder
  onSort: any
}

type ManagedTableState = {
  highlightedRows: TableHighlightedRows
  columnOrder?: TableColumnRawOrder
  columnSizes?: TableColumnSizes
}

/**
 * Wrapper around `Table` that handles row state.
 *
 * If you require lower level access to the state then use [`<Table>`]()
 * directly.
 */
export class ManagedTable extends React.PureComponent<
  ManagedTableProps,
  ManagedTableState
> {
  static getDerivedStateFromProps(
    props: ManagedTableProps,
    state: ManagedTableState,
  ) {
    let nextState
    // if columnSizes has changed
    if (!isEqual(props.columnSizes, state.columnSizes)) {
      nextState = {
        columnSizes: {
          ...(state.columnSizes || {}),
          ...props.columnSizes,
        },
      }
    }
    // if columnOrder has changed
    if (!isEqual(props.columnOrder, state.columnOrder)) {
      nextState = {
        ...nextState,
        columnOrder: props.columnOrder,
      }
    }
    // return nextState
    if (nextState) {
      return nextState
    } else {
      return null
    }
  }

  getTableKey = (): string => {
    return (
      'TABLE_COLUMNS_' +
      Object.keys(this.props.columns)
        .join('_')
        .toUpperCase()
    )
  }

  state = {
    columnOrder:
      JSON.parse(window.localStorage.getItem(this.getTableKey()) || 'null') ||
      this.props.columnOrder,
    columnSizes: this.props.columnSizes,
    highlightedRows: [],
  }

  tableRef?: Table

  onHighlight = (highlightedRows: TableHighlightedRows) => {
    if (this.props.highlightableRows === false) {
      return
    }
    if (this.props.multiHighlight !== true) {
      highlightedRows = highlightedRows.slice(0, 1)
    }

    this.setState({ highlightedRows })

    if (this.props.onRowHighlighted) {
      this.props.onRowHighlighted(highlightedRows)
    }
  }

  onColumnOrder = (columnOrder: TableColumnOrder) => {
    this.setState({ columnOrder })
    // persist column order
    window.localStorage.setItem(this.getTableKey(), JSON.stringify(columnOrder))
  }

  onColumnResize = (columnSizes: TableColumnSizes) => {
    this.setState({ columnSizes })
  }

  setRef = (table?: Table) => {
    this.tableRef = table
  }

  scrollToBottom() {
    const { tableRef } = this
    if (tableRef) {
      tableRef.scrollToBottom()
    }
  }

  render() {
    const { props, state } = this
    if ((!props.rows || !props.rows.length) && props.bodyPlaceholder) {
      return props.bodyPlaceholder
    }
    return (
      <Table
        ref={this.setRef}
        virtual={props.virtual}
        floating={props.floating}
        multiline={props.multiline}
        columns={props.columns}
        rows={props.rows}
        rowLineHeight={props.rowLineHeight}
        autoHeight={props.autoHeight}
        filter={props.filter}
        filterValue={props.filterValue}
        highlightedRows={state.highlightedRows}
        onHighlight={this.onHighlight}
        sortOrder={props.sortOrder}
        onSort={props.onSort}
        columnOrder={state.columnOrder}
        onColumnOrder={this.onColumnOrder}
        columnSizes={state.columnSizes}
        onColumnResize={this.onColumnResize}
        stickyBottom={props.stickyBottom}
        onAddFilter={props.onAddFilter}
        zebra={props.zebra}
        hideHeader={props.hideHeader}
      />
    )
  }
}
