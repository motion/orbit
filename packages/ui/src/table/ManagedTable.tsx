/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import {
  TableColumnOrder,
  TableColumnSizes,
  TableColumns,
  TableHighlightedRows,
  TableRowSortOrder,
  TableRows,
  TableBodyRow,
  TableOnAddFilter,
} from './types'

import * as React from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeList as List } from 'react-window'
import debounceRender from 'react-debounce-render'
import { debounce } from 'lodash'
import { DEFAULT_ROW_HEIGHT } from './types'
import { view, isEqual } from '@mcro/black'
import { TableRow } from './TableRow'
import { TableHead } from './TableHead'
import ContextMenu from '../ContextMenu'
import { getSortedRows } from './getSortedRows'

// @ts-ignore
const Electron = electronRequire('electron')
const clipboard = Electron.clipboard

const filterRows = (
  rows: TableRows,
  filterValue?: string,
  filter?: (row: TableBodyRow) => boolean,
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

export type ManagedTableProps = {
  /**
   * Column definitions.
   */
  columns: TableColumns
  /**
   * Row definitions.
   */
  rows: TableRows
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
  columnOrder?: TableColumnOrder
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

  sortOrder?: TableRowSortOrder
  onCreatePaste?: Function
}

type ManagedTableState = {
  highlightedRows: Set<string>
  sortOrder?: TableRowSortOrder
  sortedRows?: TableRows
  columnOrder: TableColumnOrder
  columnSizes: TableColumnSizes
  shouldScrollToBottom: boolean
  shouldRecalculateHeight?: boolean
  prevProps: Partial<ManagedTableProps> | {}
}

const Container = view({
  flex: 1,
})

class ManagedTableInner extends React.Component<ManagedTableProps, ManagedTableState> {
  static defaultProps = {
    highlightableRows: true,
    multiHighlight: false,
    autoHeight: false,
  }

  static getDerivedStateFromProps = (props, state) => {
    const { prevProps } = state
    let nextState = {}

    // if columnSizes has changed
    if (props.columnSizes !== prevProps.columnSizes) {
      nextState = {
        columnSizes: {
          ...(state.columnSizes || {}),
          ...props.columnSizes,
        },
      }
    }

    // if columnOrder has changed
    if (props.columnOrder !== prevProps.columnOrder) {
      nextState = {
        ...nextState,
        columnOrder: props.columnOrder,
      }
    }

    if (!prevProps.rows || prevProps.rows.length > props.rows.length) {
      nextState = {
        ...nextState,
        shouldRecalculateHeights: true,
      }
    }

    if (
      !isEqual(prevProps.filter, props.filter) ||
      !isEqual(prevProps.filterValue, props.filterValue) ||
      !isEqual(prevProps.sortOrder, props.sortOrder) ||
      !prevProps.rows ||
      prevProps.rows.length !== props.rows.length
    ) {
      // need to reorder or refilter the rows
      nextState = {
        ...nextState,
        sortedRows: getSortedRows(
          props.sortOrder,
          filterRows(props.rows, props.filterValue, props.filter),
        ),
      }
    }

    // update if needed
    if (Object.keys(nextState).length) {
      return {
        ...nextState,
        prevProps: props,
      }
    }

    return null
  }

  getTableKey = (): string => {
    return (
      'TABLE_COLUMNS_' +
      Object.keys(this.props.columns)
        .join('_')
        .toUpperCase()
    )
  }

  state: ManagedTableState = {
    columnOrder:
      JSON.parse(window.localStorage.getItem(this.getTableKey()) || 'null') ||
      this.props.columnOrder ||
      Object.keys(this.props.columns).map(key => ({ key, visible: true })),
    columnSizes: this.props.columnSizes || {},
    highlightedRows: new Set(),
    sortOrder: null,
    sortedRows: null,
    shouldScrollToBottom: Boolean(this.props.stickyBottom),
    prevProps: {},
  }

  tableRef: {
    current: null | List
  } = React.createRef()
  scrollRef: {
    current: null | HTMLDivElement
  } = React.createRef()
  dragStartIndex?: number = null

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown)
  }

  componentDidUpdate(prevProps: ManagedTableProps) {
    if (this.state.shouldRecalculateHeight) {
      // rows were filtered, we need to recalculate heights
      this.tableRef.current.resetAfterIndex(0)
      this.setState({
        shouldRecalculateHeight: false,
      })
    }
    if (
      this.props.rows.length !== prevProps.rows.length &&
      this.state.shouldScrollToBottom &&
      this.state.highlightedRows.size < 2
    ) {
      this.scrollToBottom()
    }
  }

  onCopy = () => {
    clipboard.writeText(this.getSelectedText())
  }

  onKeyDown = (e: KeyboardEvent) => {
    const { highlightedRows } = this.state
    if (highlightedRows.size === 0) {
      return
    }
    if (
      ((e.metaKey && process.platform === 'darwin') ||
        (e.ctrlKey && process.platform !== 'darwin')) &&
      e.keyCode === 67
    ) {
      this.onCopy()
    } else if ((e.keyCode === 38 || e.keyCode === 40) && this.props.highlightableRows) {
      // arrow navigation
      const { highlightedRows, sortedRows } = this.state
      const lastItemKey = Array.from(this.state.highlightedRows).pop()
      const lastItemIndex = sortedRows.findIndex(row => row.key === lastItemKey)
      const newIndex = Math.min(
        sortedRows.length - 1,
        Math.max(0, e.keyCode === 38 ? lastItemIndex - 1 : lastItemIndex + 1),
      )
      if (!e.shiftKey) {
        highlightedRows.clear()
      }
      highlightedRows.add(sortedRows[newIndex].key)
      this.onRowHighlighted(highlightedRows, () => {
        const { current } = this.tableRef
        if (current) {
          current.scrollToItem(newIndex)
        }
      })
    }
  }

  onRowHighlighted = (highlightedRows: Set<string>, cb = () => {}) => {
    if (!this.props.highlightableRows) {
      return
    }
    this.setState({ highlightedRows }, cb)
    const { onRowHighlighted } = this.props
    if (onRowHighlighted) {
      onRowHighlighted(Array.from(highlightedRows))
    }
  }

  onSort = (sortOrder: TableRowSortOrder) => {
    const sortedRows = getSortedRows(
      sortOrder,
      filterRows(this.props.rows, this.props.filterValue, this.props.filter),
    )
    this.setState({ sortOrder, sortedRows })
  }

  onColumnOrder = (columnOrder: TableColumnOrder) => {
    this.setState({ columnOrder })
    // persist column order
    window.localStorage.setItem(this.getTableKey(), JSON.stringify(columnOrder))
  }

  onColumnResize = (columnSizes: TableColumnSizes) => {
    this.setState({ columnSizes })
  }

  scrollToBottom() {
    const { current: tableRef } = this.tableRef
    const { sortedRows } = this.state
    if (tableRef && sortedRows.length > 1) {
      tableRef.scrollToItem(sortedRows.length - 1)
    }
  }

  onHighlight = (e: React.MouseEvent, row: TableBodyRow, index: number) => {
    if (e.button !== 0 || !this.props.highlightableRows) {
      // Only highlight rows when using primary mouse button,
      // otherwise do nothing, to not interfere context menus.
      return
    }
    if (e.shiftKey) {
      // prevents text selection
      e.preventDefault()
    }

    let { highlightedRows } = this.state

    this.dragStartIndex = index
    document.addEventListener('mouseup', this.onStopDragSelecting)

    if (
      ((e.metaKey && process.platform === 'darwin') ||
        (e.ctrlKey && process.platform !== 'darwin')) &&
      this.props.multiHighlight
    ) {
      highlightedRows.add(row.key)
    } else if (e.shiftKey && this.props.multiHighlight) {
      // range select
      const lastItemKey = Array.from(this.state.highlightedRows).pop()
      highlightedRows = new Set([...highlightedRows, ...this.selectInRange(lastItemKey, row.key)])
    } else {
      // single select
      this.state.highlightedRows.clear()
      this.state.highlightedRows.add(row.key)
    }

    this.onRowHighlighted(highlightedRows)
  }

  onStopDragSelecting = () => {
    this.dragStartIndex = null
    document.removeEventListener('mouseup', this.onStopDragSelecting)
  }

  selectInRange = (fromKey: string, toKey: string): Array<string> => {
    const rows = this.state.sortedRows
    const selected = []
    let startIndex = -1
    let endIndex = -1
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].key === fromKey) {
        startIndex = i
      }
      if (rows[i].key === toKey) {
        endIndex = i
      }
      if (endIndex > -1 && startIndex > -1) {
        break
      }
    }

    for (let i = Math.min(startIndex, endIndex); i <= Math.max(startIndex, endIndex); i++) {
      try {
        selected.push(rows[i].key)
      } catch (e) {}
    }

    return selected
  }

  onMouseEnterRow = (_: React.MouseEvent, row: TableBodyRow, index: number) => {
    const { dragStartIndex } = this
    const { current } = this.tableRef
    if (
      typeof dragStartIndex === 'number' &&
      current &&
      this.props.multiHighlight &&
      this.props.highlightableRows
    ) {
      current.scrollToItem(index + 1)
      const startKey = this.state.sortedRows[dragStartIndex].key
      const highlightedRows = new Set(this.selectInRange(startKey, row.key))
      this.onRowHighlighted(highlightedRows)
    }
  }

  buildContextMenuItems = () => {
    const { highlightedRows } = this.state
    if (highlightedRows.size === 0) {
      return []
    }

    return [
      {
        label: highlightedRows.size > 1 ? `Copy ${highlightedRows.size} rows` : 'Copy row',
        click: this.onCopy,
      },
      {
        label: 'Create Paste',
        click: () => this.props.onCreatePaste(this.getSelectedText()),
      },
    ]
  }

  getSelectedText = (): string => {
    const { highlightedRows, sortedRows } = this.state
    if (highlightedRows.size === 0) {
      return ''
    }
    return sortedRows
      .filter(row => highlightedRows.has(row.key))
      .map(
        (row: TableBodyRow) =>
          row.copyText ||
          Array.from(document.querySelectorAll(`[data-key='${row.key}'] > *`) || [])
            .map(node => node.textContent)
            .join('\t'),
      )
      .join('\n')
  }

  onScroll = debounce(
    ({
      scrollDirection,
      scrollOffset,
    }: {
      scrollDirection: 'forward' | 'backward'
      scrollOffset: number
      scrollUpdateWasRequested: boolean
    }) => {
      const { current } = this.scrollRef
      const parent = current ? current.parentElement : null
      if (
        this.props.stickyBottom &&
        scrollDirection === 'forward' &&
        !this.state.shouldScrollToBottom &&
        current &&
        parent instanceof HTMLElement &&
        current.offsetHeight - (scrollOffset + parent.offsetHeight) < parent.offsetHeight
      ) {
        this.setState({ shouldScrollToBottom: true })
      } else if (
        this.props.stickyBottom &&
        scrollDirection === 'backward' &&
        this.state.shouldScrollToBottom
      ) {
        this.setState({ shouldScrollToBottom: false })
      }
    },
    100,
  )

  getRow = ({ index, style }) => {
    const { onAddFilter, multiline, zebra } = this.props
    const { columnOrder, columnSizes, highlightedRows, sortedRows } = this.state
    const columnKeys = columnOrder.map(k => (k.visible ? k.key : null)).filter(Boolean)
    return (
      <TableRow
        key={sortedRows[index].key}
        columnSizes={columnSizes}
        columnKeys={columnKeys}
        onMouseDown={e => this.onHighlight(e, sortedRows[index], index)}
        onMouseEnter={e => this.onMouseEnterRow(e, sortedRows[index], index)}
        multiline={multiline}
        rowLineHeight={24}
        highlighted={highlightedRows.has(sortedRows[index].key)}
        row={sortedRows[index]}
        index={index}
        style={style}
        onAddFilter={onAddFilter}
        zebra={zebra}
      />
    )
  }

  render() {
    const { columns, rowLineHeight } = this.props
    const { columnOrder, columnSizes, sortedRows } = this.state

    return (
      <Container>
        <TableHead
          columnOrder={columnOrder}
          onColumnOrder={this.onColumnOrder}
          columns={columns}
          onColumnResize={this.onColumnResize}
          sortOrder={this.state.sortOrder}
          columnSizes={columnSizes}
          onSort={this.onSort}
        />
        <Container>
          {this.props.autoHeight ? (
            sortedRows.map((_, index) => this.getRow({ index, style: {} }))
          ) : (
            <AutoSizer>
              {({ width, height }) => (
                <ContextMenu buildItems={this.buildContextMenuItems}>
                  <List
                    itemCount={sortedRows.length}
                    itemSize={index =>
                      (sortedRows[index] && sortedRows[index].height) ||
                      rowLineHeight ||
                      DEFAULT_ROW_HEIGHT
                    }
                    ref={this.tableRef}
                    width={width}
                    estimatedItemSize={rowLineHeight || DEFAULT_ROW_HEIGHT}
                    overscanCount={5}
                    forwardRef={this.scrollRef}
                    onScroll={this.onScroll}
                    height={height}
                  >
                    {this.getRow}
                  </List>
                </ContextMenu>
              )}
            </AutoSizer>
          )}
        </Container>
      </Container>
    )
  }
}

export const ManagedTable = debounceRender(ManagedTableInner, 150, {
  maxWait: 250,
})
