/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */
import { isDefined } from '@o/utils'
import { gloss } from 'gloss'
import { debounce, isEqual, throttle } from 'lodash'
import memoize from 'memoize-weak'
import React, { createRef } from 'react'
import debounceRender from 'react-debounce-render'

import { ContextMenu } from '../ContextMenu'
import { FilterableProps, filterRows } from '../Filterable'
import { normalizeRow } from '../forms/normalizeRow'
import { DynamicListControlled } from '../lists/DynamicList'
import { SelectableVariableList } from '../lists/SelectableList'
import { SelectableProps, SelectableStore } from '../lists/SelectableStore'
import { SectionProps } from '../Section'
import { Text } from '../text/Text'
import { DataColumns, DataType, GenericDataRow } from '../types'
import { Col } from '../View/Col'
import { getSortedRows } from './getSortedRows'
import { TableHead } from './TableHead'
import { TableRow } from './TableRow'
import { SortOrder, TableColumnOrder, TableColumnSizes, TableOnAddFilter, TableRows } from './types'

// @ts-ignore
const Electron = typeof electronRequire !== 'undefined' ? electronRequire('electron') : {}
const clipboard = Electron.clipboard

export type ManagedTableProps = SelectableProps &
  Pick<FilterableProps, 'filter' | 'filterValue'> & {
    containerRef?: any
    overflow?: SectionProps['overflow']
    flex?: SectionProps['flex']
    margin?: SectionProps['margin']
    padding?: SectionProps['padding']
    width?: number
    height?: number

    minWidth?: number
    minHeight?: number

    maxHeight?: number
    maxWidth?: number

    /**
     * Column definitions.
     */
    columns: DataColumns
    /**
     * Row data
     */
    items?: GenericDataRow[]
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
    placeholder?: React.ReactNode | ((items: ManagedTableProps['items']) => React.ReactNode)

    // some props from virutal list, TODO make them all
    overscanCount?: number
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

const TableContainer = gloss(Col, {
  minHeight: 'min-content',
  overflow: 'hidden',
})

class ManagedTableInner extends React.Component<ManagedTableProps, ManagedTableState> {
  static defaultProps: Partial<ManagedTableProps> = {
    zebra: true,
    selectable: false,
    rowLineHeight: 24,
    placeholder: items =>
      !items ? (
        <div style={{ margin: 'auto' }}>
          <Text size={1.2}>Loading...</Text>
        </div>
      ) : null,
  }

  state: ManagedTableState = {
    columnOrder: [],
    columnSizes: this.props.columnSizes,
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
      nextState.columnSizes = props.columnSizes
    }

    if (!props.columnSizes && !state.columnSizes) {
      nextState.columnSizes = calculateColumnSizes(props.columns)
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

    if (!prevProps.items || prevProps.items.length > props.items.length) {
      nextState.shouldRecalculateHeight = true
    }

    if (
      !isEqual(prevProps.filter, props.filter) ||
      !isEqual(prevProps.filterValue, props.filterValue) ||
      !isEqual(prevProps.sortOrder, props.sortOrder) ||
      !prevProps.items ||
      prevProps.items.length !== props.items.length ||
      // TODO
      // rough check, we should enforce changing key but need to figure out
      (props.items.length && !isEqual(prevProps.items[0], props.items[0]))
    ) {
      // need to reorder or refilter the items
      nextState.sortedRows = getSortedRows(
        props.sortOrder,
        filterRows(props.items, props.filterValue, props.filter),
      )
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

  listRef = createRef<DynamicListControlled>()
  scrollRef = createRef<HTMLDivElement>()
  dragStartIndex?: number = null
  selectableStoreRef = createRef<SelectableStore>()

  get selectableStore() {
    return (
      (this.props.selectableStoreRef && this.props.selectableStoreRef.current) ||
      this.selectableStoreRef.current
    )
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown)
  }

  updateList = throttle(() => {
    this.listRef.current.resetAfterIndex(0, true)
  }, 30)

  componentDidUpdate(prevProps: ManagedTableProps) {
    this.updateList()

    if (this.state.shouldRecalculateHeight) {
      // rows were filtered, we need to recalculate heights
      console.warn('may need to recalc height')
      // this.listRef.current.resetAfterIndex(0, true)
      this.setState({
        shouldRecalculateHeight: false,
      })
    }
    if (
      this.props.items.length !== prevProps.items.length &&
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
    if (!this.selectableStore) {
      return
    }
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
      filterRows(this.props.items, this.props.filterValue, this.props.filter),
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
    const { sortedRows } = this.state
    if (this.listRef.current && sortedRows.length > 1) {
      this.listRef.current.scrollTo(sortedRows.length - 1)
    }
  }

  lastIndex = -1

  buildContextMenuItems = () => {
    if (!this.selectableStore) {
      return
    }
    const { active } = this.selectableStore
    if (active.size === 0) {
      return []
    }
    return [
      {
        label: active.size > 1 ? `Copy ${active.size} items` : 'Copy row',
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

  renderRow = memoize(({ index, style }) => {
    const { columns, onAddFilter, multiline, zebra, rowLineHeight } = this.props
    const { columnOrder, columnSizes, sortedRows } = this.state
    const columnKeys = columnOrder.map(k => (k.visible ? k.key : null)).filter(Boolean)
    const store = this.selectableStore
    return (
      <TableRow
        key={sortedRows[index].key}
        rowKey={sortedRows[index].key}
        columnSizes={columnSizes}
        columnKeys={columnKeys}
        columns={columns}
        onMouseDown={e => store && store.setRowMouseDown(index, e)}
        onMouseEnter={() => store && store.onHoverRow(index)}
        multiline={multiline}
        rowLineHeight={rowLineHeight}
        row={sortedRows[index]}
        index={index}
        style={style}
        onAddFilter={onAddFilter}
        zebra={zebra}
        selectableStore={store}
      />
    )
  })

  getItemKey = (index: number) => {
    const { sortedRows } = this.state
    const { active } = this.selectableStore
    const row = sortedRows[index]
    const hld = active.has(sortedRows[index].key)
    return !row ? index : `${row.key}${hld}`
  }

  getRowHeight = (index: number) => {
    const { sortedRows } = this.state
    return (sortedRows[index] && sortedRows[index].height) || this.props.rowLineHeight
  }

  render() {
    const {
      columns,
      width,
      height,
      minHeight,
      minWidth,
      items,
      placeholder,
      containerRef,
      overscanCount = 6,
      ...viewProps
    } = this.props
    const { columnOrder, columnSizes, sortedRows } = this.state

    const placeholderElement =
      !items ||
      (!sortedRows.length &&
        (typeof placeholder === 'function' ? placeholder(items) : placeholder)) ||
      null

    return (
      <TableContainer
        minHeight={minHeight}
        minWidth={minWidth}
        margin={viewProps.margin}
        padding={viewProps.padding}
        flex={viewProps.flex}
        overflow={viewProps.overflow}
        width={width}
        height={height}
        ref={containerRef}
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
          <SelectableVariableList
            itemCount={sortedRows.length}
            itemSize={this.getRowHeight}
            itemData={this.state.sortedRows}
            listRef={this.listRef}
            outerRef={this.scrollRef}
            onScroll={this.onScroll}
            selectableStoreRef={this.selectableStoreRef}
            {...this.props}
            width="100%"
            // for now just hardcoded TableHead height
            height={height - 23}
            overscanCount={overscanCount}
          >
            {this.renderRow}
          </SelectableVariableList>
        </ContextMenu>
      </TableContainer>
    )
  }
}

function ManagedTableNormalized(props: ManagedTableProps) {
  return <ManagedTableInner {...props} items={props.items.map(normalizeRow)} />
}

export const ManagedTable = debounceRender(ManagedTableNormalized, 100)

// this will:
//    1. if no flex provided, assume that strings should flex double anything else
//    2. if any flex provided, default rest to flex 1
//    3. calculate the percentage width based on flexes
function calculateColumnSizes(columns: DataColumns): TableColumnSizes {
  const values = Object.keys(columns).map(k => columns[k])
  const isUncontrolled = values.every(x => !isDefined(x.flex))
  const flexes = values.map(val => {
    if (isUncontrolled) {
      return !val.type || val.type === DataType.string ? 2 : 1
    } else {
      return val.flex || 1
    }
  })
  const totalFlex = flexes.reduce((a, b) => a + b, 0)
  const sizes = {}
  for (const [index, key] of Object.keys(columns).entries()) {
    if (index === values.length - 1) {
      continue
    }
    const flex = flexes[index] || 1
    sizes[key] = `${(flex / totalFlex) * 100}%`
  }
  return sizes
}
