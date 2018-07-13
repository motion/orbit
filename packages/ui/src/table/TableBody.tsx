/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import { view } from '@mcro/black'
import * as React from 'react'
import {
  TableBodyRow,
  TableColumnKeys,
  TableColumnSizes,
  TableHighlightedRows,
  TableOnDragSelect,
  TableOnHighlight,
  TableRows,
  TableOnAddFilter,
} from './types'
import { FixedList } from '../FixedList'
import { DynamicList } from '../DynamicList'
import { normaliseColumnWidth } from './utils'
import { PureComponent } from 'react'
import FilterRow from './FilterRow'
import { DEFAULT_ROW_HEIGHT } from './types'
import { Col } from '../blocks/Col'
import { Row } from '../blocks/Row'
// import ContextMenu from '../ContextMenu'
import { colors } from '../helpers/colors'

const TableBodyContainer = view(Col, {
  backgroundColor: colors.white,
  zIndex: 1,
  maxWidth: '100%',
})

TableBodyContainer.theme = ({ autoHeight }) => ({
  flexGrow: autoHeight ? 0 : 1,
  flexShrink: autoHeight ? 0 : 1,
  flexBasis: autoHeight ? 'content' : 0,
  overflow: autoHeight ? 'hidden' : 'visible',
})

const TableBodyRowContainer = view(Row, {
  overflow: 'hidden',
  width: '100%',
  userSelect: 'none',
  flexShrink: 0,
})

const getBackgroundColor = ({
  highlighted,
  highlightedBackgroundColor,
  backgroundColor,
  even,
  zebra,
}) => {
  if (highlighted) {
    if (highlightedBackgroundColor) {
      return highlightedBackgroundColor
    } else {
      return colors.macOSTitleBarIconSelected
    }
  } else {
    if (backgroundColor) {
      return backgroundColor
    } else if (even && zebra) {
      return colors.light02
    } else {
      return 'transparent'
    }
  }
}

TableBodyRowContainer.theme = props => {
  const {
    color,
    backgroundColor,
    rowLineHeight,
    highlighted,
    multiline,
    zebra,
    fontWeight,
    highlightOnHover,
  } = props
  return {
    height: multiline ? 'auto' : rowLineHeight,
    lineHeight: `${String(rowLineHeight)}px`,
    fontWeight: fontWeight || 'inherit',
    backgroundColor: getBackgroundColor(props),
    boxShadow:
      backgroundColor || zebra === false ? 'inset 0 -1px #E9EBEE' : 'none',
    color: highlighted ? colors.white : color || 'inherit',
    '& *': {
      color: highlighted ? `${colors.white} !important` : null,
    },
    '& img': {
      backgroundColor: highlighted ? `${colors.white} !important` : 'none',
    },
    '&:hover': {
      backgroundColor:
        highlighted && highlightOnHover ? colors.light02 : 'none',
    },
  }
}

const TableBodyColumnContainer = view({
  display: 'flex',
  overflow: 'hidden',
  padding: '0 8px',
  userSelect: 'none',
  textOverflow: 'ellipsis',
  verticalAlign: 'top',
  maxWidth: '100%',
})

TableBodyColumnContainer.theme = ({ width, multiline }) => ({
  flexShrink: width === 'flex' ? 1 : 0,
  whiteSpace: multiline ? 'normal' : 'nowrap',
  wordWrap: multiline ? 'break-word' : 'normal',
  width: width === 'flex' ? '100%' : width,
})

type TableBodyRowElementProps = {
  columnSizes: TableColumnSizes
  columnKeys: TableColumnKeys
  onHighlight: TableOnHighlight | null | undefined
  onMouseEnter?: (e: MouseEvent) => void
  multiline: boolean | null | undefined
  rowLineHeight: number
  highlightedRows: TableHighlightedRows | null | undefined
  row: TableBodyRow
  columnNo: number
  style: Object | null | undefined
  onCopyRows: () => void
  onCreatePaste: () => void
  onAddFilter?: TableOnAddFilter
  zebra: boolean | null | undefined
}

type TableBodyRowElementState = {
  contextMenu: any
}

class TableBodyRowElement extends PureComponent<
  TableBodyRowElementProps,
  TableBodyRowElementState
> {
  static defaultProps = {
    zebra: true,
  }

  onMouseDown = (e: MouseEvent) => {
    if (e.button !== 0) {
      // Only highlight rows when using primary mouse button,
      // otherwise do nothing, to not interfere context menus.
      return
    }
    if (e.shiftKey) {
      // prevents text selection
      e.preventDefault()
    }

    const { highlightedRows, onHighlight, row } = this.props
    if (!onHighlight) {
      return
    }

    let newHighlightedRows = highlightedRows ? highlightedRows.slice() : []
    const alreadyHighlighted = newHighlightedRows.includes(row.key)
    if (
      (e.metaKey && process.platform === 'darwin') ||
      (e.ctrlKey && process.platform !== 'darwin')
    ) {
      if (alreadyHighlighted) {
        newHighlightedRows.splice(newHighlightedRows.indexOf(row.key), 1)
      } else {
        newHighlightedRows.push(row.key)
      }
    } else {
      newHighlightedRows = [row.key]
    }
    onHighlight(newHighlightedRows, e)
  }

  getContextMenu = () => {
    const { highlightedRows, onCopyRows, onCreatePaste } = this.props
    return [
      {
        label:
          highlightedRows && highlightedRows.length > 1
            ? `Copy ${highlightedRows.length} items`
            : 'Copy all',
        click: onCopyRows,
      },
      {
        label:
          highlightedRows && highlightedRows.length > 1
            ? `Create paste from selection`
            : 'Create paste',
        click: onCreatePaste,
      },
    ]
  }

  render() {
    const {
      columnNo,
      highlightedRows,
      rowLineHeight,
      row,
      style,
      multiline,
      columnKeys,
      columnSizes,
      onMouseEnter,
      zebra,
    } = this.props

    return (
      // <ContextMenu buildItems={this.getContextMenu}>
      <TableBodyRowContainer
        rowLineHeight={rowLineHeight}
        highlightedBackgroundColor={row.highlightedBackgroundColor}
        backgroundColor={row.backgroundColor}
        highlighted={highlightedRows && highlightedRows.includes(row.key)}
        onDoubleClick={row.onDoubleClick}
        multiline={multiline}
        even={columnNo % 2 === 0}
        zebra={zebra}
        onMouseDown={this.onMouseDown}
        onMouseEnter={onMouseEnter}
        style={style}
        highlightOnHover={row.highlightOnHover}
        data-key={row.key}
        {...row.style}
      >
        {columnKeys.map(key => {
          const col = row.columns[key]
          if (col == null) {
            throw new Error(
              `Trying to access column "${key}" which does not exist on row. Make sure buildRow is returning a valid row.`,
            )
          }
          const isFilterable = col.isFilterable || false
          const value = col ? col.value : ''
          const title = col ? col.title : ''
          return (
            <TableBodyColumnContainer
              key={key}
              title={title}
              multiline={multiline}
              width={normaliseColumnWidth(columnSizes[key])}
            >
              {isFilterable && this.props.onAddFilter != null ? (
                <FilterRow addFilter={this.props.onAddFilter} filterKey={key}>
                  {value}
                </FilterRow>
              ) : (
                value
              )}
            </TableBodyColumnContainer>
          )
        })}
      </TableBodyRowContainer>
      // </ContextMenu>
    )
  }
}

type TableBodyProps = {
  virtual: boolean | null | undefined
  autoHeight: boolean | null | undefined
  multiline: boolean | null | undefined
  rowLineHeight: number
  stickyBottom: boolean | null | undefined
  zebra?: boolean

  onHighlight: TableOnHighlight | null | undefined
  highlightedRows: TableHighlightedRows | null | undefined

  columnKeys: TableColumnKeys
  columnSizes: TableColumnSizes

  rows: TableRows

  filterValue?: string
  filter?: (row: TableBodyRow) => boolean

  isDragging: boolean
  onDragSelect: TableOnDragSelect
  onCopyRows: () => void
  onCreatePaste: () => void
  onAddFilter?: TableOnAddFilter
}

type TableBodyState = {
  atScrollBottom: boolean
  pureBodyData: Array<any>
}

export default class TableBody extends PureComponent<
  TableBodyProps,
  TableBodyState
> {
  static defaultProps = {
    rowLineHeight: DEFAULT_ROW_HEIGHT,
  }

  state = {
    atScrollBottom: true,
    pureBodyData: [
      this.props.columnSizes,
      this.props.rows,
      this.props.highlightedRows,
    ],
  }

  listRef: DynamicList | null | undefined
  scrollRef: any | null | undefined
  keepSelectedRowInView: [number, number] | null | undefined

  buildElement = (
    key: string,
    row: TableBodyRow,
    index: number,
    style?: Object,
  ) => {
    let onMouseEnter
    if (this.props.isDragging) {
      onMouseEnter = (e: MouseEvent) => this.props.onDragSelect(e, key, index)
    }
    return (
      <TableBodyRowElement
        key={key}
        columnNo={index}
        rowLineHeight={this.props.rowLineHeight}
        row={row}
        style={style}
        columnSizes={this.props.columnSizes}
        multiline={this.props.multiline}
        columnKeys={this.props.columnKeys}
        highlightedRows={this.props.highlightedRows}
        zebra={this.props.zebra}
        onHighlight={this.props.onHighlight}
        onMouseEnter={onMouseEnter}
        onCopyRows={this.props.onCopyRows}
        onCreatePaste={this.props.onCreatePaste}
        onAddFilter={this.props.onAddFilter}
      />
    )
  }

  buildVirtualElement = ({
    index,
    style,
  }: {
    index: number
    style: Object
  }) => {
    const row = this.props.rows[index]
    return this.buildElement(row.key, row, index, style)
  }

  buildAutoElement = (row: TableBodyRow, index: number) => {
    return this.buildElement(row.key, row, index)
  }

  componentDidMount() {
    this.maybeScrollToBottom()
  }

  componentWillUpdate(nextProps: TableBodyProps) {
    if (
      nextProps.highlightedRows != null &&
      nextProps.highlightedRows.length === 1 &&
      nextProps.filter !== this.props.filter &&
      nextProps.rows.length !== this.props.rows.length &&
      this.listRef != null
    ) {
      // We want to keep the selected row in the view once the filter changes.
      // Here we get the current position, in componentDidUpdate it is scrolled into view
      const { highlightedRows } = nextProps
      const selectedIndex = nextProps.rows.findIndex(
        row => row.key === highlightedRows[0],
      )
      if (
        nextProps.rows[selectedIndex] != null &&
        nextProps.rows[selectedIndex].key != null
      ) {
        const rowDOMNode = document.querySelector(
          `[data-key="${nextProps.rows[selectedIndex].key}"]`,
        )
        let offset = 0
        if (
          rowDOMNode != null &&
          rowDOMNode.parentElement instanceof HTMLElement
        ) {
          offset = rowDOMNode.parentElement.offsetTop
        }
        this.keepSelectedRowInView = [selectedIndex, offset]
      }
    } else {
      this.keepSelectedRowInView = null
    }
  }

  componentDidUpdate(_prevProps: TableBodyProps) {
    if (this.listRef != null && this.keepSelectedRowInView != null) {
      this.listRef.scrollToIndex(
        this.keepSelectedRowInView[0],
        this.keepSelectedRowInView[1],
      )
    } else {
      this.maybeScrollToBottom()
    }
  }

  maybeScrollToBottom = () => {
    // we only care if we have the stickyBottom prop
    if (this.props.stickyBottom !== true) {
      return
    }

    // we only want to scroll to the bottom if we're actually at the bottom
    if (this.state.atScrollBottom === false) {
      return
    }

    this.scrollToBottom()
  }

  scrollToBottom() {
    // only handle non-virtualised scrolling, virtualised scrolling is handled
    // by the getScrollToIndex method
    if (this.isVirtualisedDisabled()) {
      const { scrollRef } = this
      if (scrollRef != null) {
        scrollRef.scrollTop = scrollRef.scrollHeight
      }
    } else {
      const { listRef } = this
      if (listRef != null) {
        listRef.scrollToIndex(this.props.rows.length - 1)
      }
    }
  }

  scrollRowIntoView(index: number) {
    if (
      this.isVirtualisedDisabled() &&
      this.scrollRef &&
      index < this.scrollRef.children.length
    ) {
      this.scrollRef.children[index].scrollIntoViewIfNeeded()
    }
  }

  componentWillReceiveProps(nextProps: TableBodyProps) {
    if (
      nextProps.columnSizes !== this.props.columnSizes ||
      nextProps.rows !== this.props.rows ||
      nextProps.highlightedRows !== this.props.highlightedRows
    ) {
      this.setState({
        pureBodyData: [
          nextProps.columnSizes,
          nextProps.rows,
          nextProps.highlightedRows,
        ],
      })
    }
  }

  setListRef = (ref: DynamicList | undefined) => {
    this.listRef = ref
  }

  setNonVirtualScrollRef = (ref: any) => {
    this.scrollRef = ref
    this.scrollToBottom()
  }

  onScroll = ({
    clientHeight,
    scrollHeight,
    scrollTop,
  }: {
    clientHeight: number
    scrollHeight: number
    scrollTop: number
  }) => {
    // check if the user has scrolled within 20px of the bottom
    const bottom = scrollTop + clientHeight
    const atScrollBottom = Math.abs(bottom - scrollHeight) < 20

    if (atScrollBottom !== this.state.atScrollBottom) {
      this.setState({ atScrollBottom })
    }
  }

  isVirtualisedDisabled() {
    return this.props.virtual === false || this.props.autoHeight === true
  }

  keyMapper = (index: number): string => {
    return this.props.rows[index].key
  }

  getPrecalculatedDimensions = (index: number) => {
    const row = this.props.rows[index]
    if (row != null && row.height != null) {
      return {
        height: row.height,
        width: '100%',
      }
    }
  }

  render() {
    if (this.isVirtualisedDisabled()) {
      return (
        <TableBodyContainer
          ref={this.setNonVirtualScrollRef}
          onScroll={this.onScroll}
          autoHeight
        >
          {this.props.rows.map(this.buildAutoElement)}
        </TableBodyContainer>
      )
    }

    let children

    if (this.props.multiline === true) {
      // multiline has a virtual list with dynamic heights
      children = (
        <DynamicList
          ref={this.setListRef}
          pureData={this.state.pureBodyData}
          keyMapper={this.keyMapper}
          rowCount={this.props.rows.length}
          rowRenderer={this.buildVirtualElement}
          onScroll={this.onScroll}
          getPrecalculatedDimensions={this.getPrecalculatedDimensions}
          onMount={this.maybeScrollToBottom}
        />
      )
    } else {
      // virtual list with a fixed row height
      children = (
        <FixedList
          pureData={this.state.pureBodyData}
          keyMapper={this.keyMapper}
          rowCount={this.props.rows.length}
          rowHeight={this.props.rowLineHeight}
          rowRenderer={this.buildVirtualElement}
          onScroll={this.onScroll}
          innerRef={this.setListRef}
          onMount={this.maybeScrollToBottom}
        />
      )
    }

    return <TableBodyContainer autoHeight>{children}</TableBodyContainer>
  }
}
