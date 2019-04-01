/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import { CSSPropertySet, gloss, View } from '@o/gloss'
import { debounce, isEqual } from 'lodash'
import * as React from 'react'
import debounceRender from 'react-debounce-render'
import { ContextMenu } from '../ContextMenu'
import { normalizeRow } from '../forms/normalizeRow'
import { DynamicList, DynamicListControlled } from '../lists/DynamicList'
import { SelectableProps, SelectableStore, useSelectableStore } from '../lists/SelectableStore'
import { Text } from '../text/Text'
import { DataColumns, GenericDataRow } from '../types'
import { getSortedRows } from './getSortedRows'
import { TableHead } from './TableHead'
import { TableRow } from './TableRow'
import { SortOrder, TableColumnOrder, TableColumnSizes, TableOnAddFilter, TableRows } from './types'

// @ts-ignore
const Electron = typeof electronRequire !== 'undefined' ? electronRequire('electron') : {}
const clipboard = Electron.clipboard

export type ManagedTableProps = SelectableProps & {
  selectableStore?: SelectableStore

  overflow?: CSSPropertySet['overflow']
  flex?: CSSPropertySet['flex']
  margin?: CSSPropertySet['margin']
  padding?: CSSPropertySet['padding']
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
  rows?: GenericDataRow[]
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
  placeholder?: React.ReactNode | ((rows: ManagedTableProps['rows']) => React.ReactNode)
}

type ManagedTableState = {
  sortOrder?: SortOrder
  sortedRows?: TableRows
  columnOrder: TableColumnOrder
  columnSizes: TableColumnSizes
  shouldScrollToBottom: boolean
  shouldRecalculateHeight?: boolean
  prevProps: Partial<ManagedTableProps>
}

const Container = gloss(View, {
  minHeight: 'min-content',
})

class ManagedTableInner extends React.Component<ManagedTableProps, ManagedTableState> {
  static defaultProps: Partial<ManagedTableProps> = {
    zebra: true,
    selectable: false,
    rowLineHeight: 24,
    placeholder: rows =>
      !rows ? (
        <div style={{ margin: 'auto' }}>
          <Text size={1.2}>Loading...</Text>
        </div>
      ) : null,
  }

  state: ManagedTableState = {
    columnOrder: [],
    columnSizes: this.props.columnSizes || {},
    sortOrder: this.props.defaultSortOrder,
    sortedRows: null,
    shouldScrollToBottom: Boolean(this.props.stickyBottom),
    prevProps: {},
  }

  static getDerivedStateFromProps = (props: ManagedTableProps, state: ManagedTableState) => {
    const { prevProps } = state
    let nextState: Partial<ManagedTableState> = {}

    // if columnSizes has changed
    if (props.columnSizes !== prevProps.columnSizes) {
      nextState = {
        columnSizes: {
          ...state.columnSizes,
          ...props.columnSizes,
        },
      }
    }

    // if columnOrder has changed
    if (props.columnOrder !== prevProps.columnOrder) {
      nextState.columnOrder = props.columnOrder
    } else if (!props.columnOrder) {
      const columnOrder = Object.keys(props.columns).map(key => ({ key, visible: true }))
      if (!isEqual(columnOrder, state.columnOrder)) {
        nextState.columnOrder = columnOrder
      }
    }

    if (!prevProps.rows || prevProps.rows.length > props.rows.length) {
      nextState.shouldRecalculateHeight = true
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
      nextState.sortedRows = getSortedRows(
        props.sortOrder,
        filterRows(props.rows, props.filterValue, props.filter),
      )
      props.selectableStore.setRows(nextState.sortedRows)
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

  listRef: DynamicListControlled = null
  scrollRef = React.createRef<HTMLDivElement>()
  dragStartIndex?: number = null

  onListRef = (ref: DynamicListControlled) => {
    this.listRef = ref
    this.selectableStore.setListRef(ref)
  }

  get selectableStore() {
    return this.props.selectableStore
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown)
  }

  componentDidUpdate(prevProps: ManagedTableProps) {
    if (this.state.shouldRecalculateHeight) {
      // rows were filtered, we need to recalculate heights
      console.warn('may need to recalc height')
      // this.listRef.current.resetAfterIndex(0, true)
      this.setState({
        shouldRecalculateHeight: false,
      })
    }
    if (
      this.props.rows.length !== prevProps.rows.length &&
      this.state.shouldScrollToBottom &&
      this.selectableStore.active.size < 2
    ) {
      this.scrollToBottom()
    }
  }

  onCopy = () => {
    clipboard.writeText(this.getSelectedText())
  }

  onKeyDown = (e: KeyboardEvent) => {
    if (this.selectableStore.active.size === 0) {
      return
    }
    const copyKey =
      ((e.metaKey && process.platform === 'darwin') ||
        (e.ctrlKey && process.platform !== 'darwin')) &&
      e.keyCode === 67
    if (copyKey) {
      this.onCopy()
      return
    }
    this.selectableStore.onKeyDown(e)
  }

  onSort = (sortOrder: SortOrder) => {
    const sortedRows = getSortedRows(
      sortOrder,
      filterRows(this.props.rows, this.props.filterValue, this.props.filter),
    )
    if (this.props.selectableStore) {
      this.props.selectableStore.setRows(sortedRows)
    }
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
    const { sortedRows } = this.state
    if (this.listRef && sortedRows.length > 1) {
      this.listRef.scrollToIndex(sortedRows.length - 1)
    }
  }

  lastIndex = -1

  buildContextMenuItems = () => {
    const { active } = this.selectableStore
    if (active.size === 0) {
      return []
    }
    return [
      {
        label: active.size > 1 ? `Copy ${active.size} rows` : 'Copy row',
        click: this.onCopy,
      },
      {
        label: 'Create Paste',
        click: () => this.props.onCreatePaste(this.getSelectedText()),
      },
    ]
  }

  getSelectedText = (): string => {
    const { sortedRows } = this.state
    const { active } = this.selectableStore
    if (active.size === 0) {
      return ''
    }
    return sortedRows
      .filter(row => active.has(row.key))
      .map(
        (row: GenericDataRow) =>
          row.copyText ||
          Array.from(document.querySelectorAll(`[data-key='${row.key}'] > *`) || [])
            .map(node => node.textContent)
            .join('\t'),
      )
      .join('\n')
  }

  onScroll = debounce(({ scrollDirection, scrollTop }) => {
    const { current } = this.scrollRef
    const parent = current ? current.parentElement : null
    if (
      this.props.stickyBottom &&
      scrollDirection === 'forward' &&
      !this.state.shouldScrollToBottom &&
      current &&
      parent instanceof HTMLElement &&
      current.offsetHeight - (scrollTop + parent.offsetHeight) < parent.offsetHeight
    ) {
      this.setState({ shouldScrollToBottom: true })
    } else if (
      this.props.stickyBottom &&
      scrollDirection === 'backward' &&
      this.state.shouldScrollToBottom
    ) {
      this.setState({ shouldScrollToBottom: false })
    }
  }, 100)

  renderRow = ({ index, style }) => {
    const { columns, onAddFilter, multiline, zebra, rowLineHeight } = this.props
    const { columnOrder, columnSizes, sortedRows } = this.state
    const columnKeys = columnOrder.map(k => (k.visible ? k.key : null)).filter(Boolean)
    return (
      <TableRow
        key={sortedRows[index].key}
        rowKey={sortedRows[index].key}
        columnSizes={columnSizes}
        columnKeys={columnKeys}
        columns={columns}
        onMouseDown={e => this.selectableStore.setRowActive(index, e)}
        onMouseEnter={() => this.selectableStore.onHoverRow(index)}
        multiline={multiline}
        rowLineHeight={rowLineHeight}
        row={sortedRows[index]}
        index={index}
        style={style}
        onAddFilter={onAddFilter}
        zebra={zebra}
        selectableStore={this.selectableStore}
      />
    )
  }

  getItemKey = index => {
    const { sortedRows } = this.state
    const { active } = this.selectableStore
    const row = sortedRows[index]
    const hld = active.has(sortedRows[index].key)
    return !row ? index : `${row.key}${hld}`
  }

  getContentHeight = () => {
    const maxHeight = this.props.maxHeight || Infinity
    let height = 0
    for (let i = 0; i < this.state.sortedRows.length; i++) {
      height += this.getRowHeight(i).height
      if (height > maxHeight) {
        height = maxHeight
        break
      }
    }
    return height
  }

  getRowHeight = (index: number) => {
    const { sortedRows } = this.state
    return {
      height: (sortedRows[index] && sortedRows[index].height) || this.props.rowLineHeight,
      width: '100%',
    }
  }

  render() {
    const { columns, width, minHeight, minWidth, rows, placeholder, ...viewProps } = this.props
    const { columnOrder, columnSizes, sortedRows } = this.state
    const height =
      viewProps.height === 'content-height'
        ? this.getContentHeight()
        : Math.min(minHeight, viewProps.height || Infinity)

    const placeholderElement =
      !rows ||
      (!sortedRows.length &&
        (typeof placeholder === 'function' ? placeholder(rows) : placeholder)) ||
      null

    return (
      <Container
        minHeight={minHeight}
        minWidth={minWidth}
        margin={viewProps.margin}
        padding={viewProps.padding}
        flex={viewProps.flex}
        overflow={viewProps.overflow}
        width={width}
        height={height}
      >
        <TableHead
          columnOrder={columnOrder}
          onColumnOrder={this.onColumnOrder}
          columns={columns}
          onColumnResize={this.onColumnResize}
          sortOrder={this.state.sortOrder}
          columnSizes={columnSizes}
          onSort={this.onSort}
        />
        {placeholderElement}
        <ContextMenu buildItems={this.buildContextMenuItems}>
          <DynamicList
            keyMapper={this.getItemKey}
            itemCount={sortedRows.length}
            itemSize={this.getRowHeight}
            itemData={sortedRows}
            ref={this.onListRef}
            outerRef={this.scrollRef}
            onScroll={this.onScroll}
          >
            {this.renderRow}
          </DynamicList>
        </ContextMenu>
      </Container>
    )
  }
}

function ManagedTableNormalized(props: ManagedTableProps) {
  const selectableStore = props.selectableStore || useSelectableStore(props)
  return (
    <ManagedTableInner
      {...props}
      selectableStore={selectableStore}
      rows={props.rows.map(normalizeRow)}
    />
  )
}

export const ManagedTable = debounceRender(ManagedTableNormalized, 50, {
  maxWait: 100,
})

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
