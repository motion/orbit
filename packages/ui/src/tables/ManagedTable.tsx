/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import { gloss, View } from '@o/gloss'
import { debounce, isEqual } from 'lodash'
import * as React from 'react'
import debounceRender from 'react-debounce-render'
import { VariableSizeList } from 'react-window'
import { ContextMenu } from '../ContextMenu'
import { normalizeRow } from '../forms/normalizeRow'
import { Text } from '../text/Text'
import { DataColumns, GenericDataRow } from '../types'
import { getSortedRows } from './getSortedRows'
import { TableHead } from './TableHead'
import { TableRow } from './TableRow'
import {
  DEFAULT_ROW_HEIGHT,
  SortOrder,
  TableColumnOrder,
  TableColumnSizes,
  TableHighlightedRows,
  TableOnAddFilter,
  TableRows,
} from './types'

// @ts-ignore
const Electron = typeof electronRequire !== 'undefined' ? electronRequire('electron') : {}
const clipboard = Electron.clipboard

const filterRows = (
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

export type ManagedTableProps = {
  width?: number
  height?: number | 'content-height'

  minWidth?: number
  minHeight?: number

  maxHeight?: number

  /**
   * Column definitions.
   */
  columns: DataColumns
  /**
   * Row data
   */
  rows: GenericDataRow[]
  /**
   * Whether a row can span over multiple lines. Otherwise lines cannot wrap and
   * are truncated.
   */
  multiline?: boolean
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
  filter?: (row: GenericDataRow) => boolean
  /**
   * Callback when the highlighted rows change.
   */
  onSelectIndices?: (keys: TableHighlightedRows) => void
  /**
   * Disable highlighting rows
   */
  disableHighlight?: false
  /**
   * Whether multiple rows can be highlighted or not.
   */
  multiSelect?: boolean
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

  defaultSortOrder?: SortOrder
  sortOrder?: SortOrder
  onSortOrder?: (next: SortOrder) => any
  onCreatePaste?: Function
  bodyPlaceholder?: React.ReactNode
}

type ManagedTableState = {
  highlightedRows: Set<string>
  sortOrder?: SortOrder
  sortedRows?: TableRows
  columnOrder: TableColumnOrder
  columnSizes: TableColumnSizes
  shouldScrollToBottom: boolean
  shouldRecalculateHeight?: boolean
  prevProps: Partial<ManagedTableProps> | {}
}

const Container = gloss(View, {
  minHeight: 'min-content',
})

class ManagedTableInner extends React.Component<ManagedTableProps, ManagedTableState> {
  static defaultProps = {
    highlightableRows: true,
    multiSelect: false,
    rowLineHeight: 24,
    bodyPlaceholder: (
      <div style={{ margin: 'auto' }}>
        <Text size={1.2}>Loading...</Text>
      </div>
    ),
  }

  state: ManagedTableState = {
    columnOrder:
      JSON.parse(window.localStorage.getItem(this.getTableKey()) || 'null') ||
      this.props.columnOrder ||
      Object.keys(this.props.columns).map(key => ({ key, visible: true })),
    columnSizes: this.props.columnSizes || {},
    highlightedRows: new Set(),
    sortOrder: this.props.defaultSortOrder,
    sortedRows: null,
    shouldScrollToBottom: Boolean(this.props.stickyBottom),
    prevProps: {},
  }

  static getDerivedStateFromProps = (props, state) => {
    const { prevProps } = state
    let nextState = {}

    // if columnSizes has changed
    if (props.columnSizes !== prevProps.columnSizes) {
      console.log('new col size')
      nextState = {
        columnSizes: {
          ...state.columnSizes,
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
      prevProps.rows.length !== props.rows.length ||
      // TODO
      // rough check, we should enforce changing key but need to figure out
      (props.rows.length && !isEqual(prevProps.rows[0], props.rows[0]))
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

  getTableKey() {
    return `TABLE_COLUMNS_${Object.keys(this.props.columns)
      .join('_')
      .toUpperCase()}`
  }

  tableRef: {
    current: null | VariableSizeList
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
    } else if ((e.keyCode === 38 || e.keyCode === 40) && !this.props.disableHighlight) {
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
      this.onSelectIndices(highlightedRows, () => {
        const { current } = this.tableRef
        if (current) {
          current.scrollToItem(newIndex)
        }
      })
    }
  }

  onSelectIndices = (highlightedRows: Set<string>, cb = () => {}) => {
    if (this.props.disableHighlight) return
    this.setState({ highlightedRows }, cb)
    const { onSelectIndices } = this.props
    if (onSelectIndices) {
      onSelectIndices(Array.from(highlightedRows))
    }
  }

  onSort = (sortOrder: SortOrder) => {
    const sortedRows = getSortedRows(
      sortOrder,
      filterRows(this.props.rows, this.props.filterValue, this.props.filter),
    )
    this.setState({ sortOrder, sortedRows })
    if (this.props.onSortOrder) {
      this.props.onSortOrder(sortOrder)
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

  scrollToBottom() {
    const { current: tableRef } = this.tableRef
    const { sortedRows } = this.state
    if (tableRef && sortedRows.length > 1) {
      tableRef.scrollToItem(sortedRows.length - 1)
    }
  }

  onHighlight = (e: React.MouseEvent, row: GenericDataRow, index: number) => {
    if (e.button !== 0 || this.props.disableHighlight) {
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
      this.props.multiSelect
    ) {
      highlightedRows.add(row.key)
    } else if (e.shiftKey && this.props.multiSelect) {
      // range select
      const lastItemKey = Array.from(this.state.highlightedRows).pop()
      highlightedRows = new Set([...highlightedRows, ...this.selectInRange(lastItemKey, row.key)])
    } else {
      // single select
      this.state.highlightedRows.clear()
      this.state.highlightedRows.add(row.key)
    }

    this.onSelectIndices(highlightedRows)

    this.setState({
      highlightedRows,
    })
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

  onMouseEnterRow = (_: React.MouseEvent, row: GenericDataRow, index: number) => {
    const { dragStartIndex } = this
    const { current } = this.tableRef
    if (this.props.disableHighlight || !this.props.multiSelect) {
      return
    }
    if (typeof dragStartIndex === 'number' && current) {
      current.scrollToItem(index + 1)
      const startKey = this.state.sortedRows[dragStartIndex].key
      const highlightedRows = new Set(this.selectInRange(startKey, row.key))
      this.onSelectIndices(highlightedRows)
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
        (row: GenericDataRow) =>
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

  renderRow = ({ index, style }) => {
    const { columns, onAddFilter, multiline, zebra, rowLineHeight } = this.props
    const { columnOrder, columnSizes, highlightedRows, sortedRows } = this.state
    const columnKeys = columnOrder.map(k => (k.visible ? k.key : null)).filter(Boolean)
    return (
      <TableRow
        key={sortedRows[index].key}
        columnSizes={columnSizes}
        columnKeys={columnKeys}
        columns={columns}
        onMouseDown={e => this.onHighlight(e, sortedRows[index], index)}
        onMouseEnter={e => this.onMouseEnterRow(e, sortedRows[index], index)}
        multiline={multiline}
        rowLineHeight={rowLineHeight}
        highlighted={highlightedRows.has(sortedRows[index].key)}
        row={sortedRows[index]}
        index={index}
        style={style}
        onAddFilter={onAddFilter}
        zebra={zebra}
      />
    )
  }

  getContentHeight = () => {
    const maxHeight = this.props.maxHeight || Infinity
    let height = 0
    for (let i = 0; i < this.state.sortedRows.length; i++) {
      height += this.getRowHeight(i)
      if (height > maxHeight) {
        height = maxHeight
        break
      }
    }
    return height
  }

  getRowHeight = index => {
    const { sortedRows } = this.state
    return (
      (sortedRows[index] && sortedRows[index].height) ||
      this.props.rowLineHeight ||
      DEFAULT_ROW_HEIGHT
    )
  }

  render() {
    const { columns, rowLineHeight, width, minHeight, minWidth, height } = this.props
    const { columnOrder, columnSizes, sortedRows } = this.state

    return (
      <Container minHeight={minHeight} minWidth={minWidth}>
        <TableHead
          columnOrder={columnOrder}
          onColumnOrder={this.onColumnOrder}
          columns={columns}
          onColumnResize={this.onColumnResize}
          sortOrder={this.state.sortOrder}
          columnSizes={columnSizes}
          onSort={this.onSort}
        />
        {(!sortedRows.length && this.props.bodyPlaceholder) || null}
        <ContextMenu buildItems={this.buildContextMenuItems}>
          <VariableSizeList
            itemCount={sortedRows.length}
            itemSize={this.getRowHeight}
            // whenever this view renders, update list, otherwise highlights break
            itemData={Math.random()}
            ref={this.tableRef}
            width={width}
            height={
              height === 'content-height'
                ? this.getContentHeight()
                : Math.min(minHeight, height || Infinity)
            }
            estimatedItemSize={rowLineHeight || DEFAULT_ROW_HEIGHT}
            overscanCount={20}
            forwardRef={this.scrollRef}
            onScroll={this.onScroll}
          >
            {this.renderRow}
          </VariableSizeList>
        </ContextMenu>
      </Container>
    )
  }
}

export function ManagedTableNormalized(props: ManagedTableProps) {
  return <ManagedTableInner {...props} rows={props.rows.map(normalizeRow)} />
}

export const ManagedTable = debounceRender(ManagedTableNormalized, 50, {
  maxWait: 100,
})
