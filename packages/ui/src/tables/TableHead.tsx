/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */
import { gloss, linearGradient, Row } from 'gloss'
import invariant from 'invariant'
import * as React from 'react'

import { ContextMenu } from '../ContextMenu'
import { Interactive } from '../Interactive'
import { DataColumns, DataType } from '../types'
import { SortOrder, TableColumnOrder, TableColumnSizes, TableOnColumnResize, TableOnSort } from './types'
import { isPercentage, normaliseColumnWidth } from './utils'

const TableHeaderArrow = gloss({
  display: 'block',
  float: 'right',
  fontSize: '75%',
  opacity: 0.6,
})

const TableHeadColumnText = gloss({
  display: 'inline-block',
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  opacity: 0.65,
  fontSize: 11,
})

const TableHeaderColumnInteractive = gloss(Interactive, {
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}).theme((_, theme) => ({
  '&:hover': {
    background: theme.backgroundHover.alpha(x => x * 0.25),
  },
  '&:active': {
    background: theme.backgroundHover,
  },
}))

const TableHeaderColumnContainer = gloss({
  flexFlow: 'row',
  padding: '0 8px',
})

const TableHeadContainer = gloss(Row, {
  flexShrink: 0,
  left: 0,
  overflow: 'hidden',
  position: 'sticky',
  right: 0,
  textAlign: 'left',
  top: 0,
  zIndex: 2,
}).theme((_, theme) => ({
  borderBottom: [1, theme.borderColorLight],
  color: theme.color,
}))

const TableHeadColumnContainer = gloss({
  flexFlow: 'row',
  justifyContent: 'space-between',
  position: 'relative',
  height: 23,
  lineHeight: '23px',
  fontSize: '0.85em',
  fontWeight: 500,
  userSelect: 'none',
  '&::after': {
    position: 'absolute',
    content: '""',
    right: 0,
    top: 4,
    height: 13,
    width: 1,
  },
  '&:last-child::after': {
    display: 'none',
  },
}).theme(({ width }, theme) => ({
  background:
    theme.tableHeadBackground || linearGradient(theme.background, theme.background.darken(0.05)),
  flexShrink: width === 'flex' ? 1 : 0,
  width: width === 'flex' ? '100%' : width,
  '&:after': {
    background: theme.borderColor,
  },
}))

const RIGHT_RESIZABLE = { right: true }

function calculatePercentage(parentWidth: number, selfWidth: number): string {
  return `${(100 / parentWidth) * selfWidth}%`
}

class TableHeadColumn extends React.PureComponent<{
  id: string
  width: string | number
  sortable?: boolean
  isResizable: boolean
  leftHasResizer: boolean
  hasFlex: boolean
  sortOrder?: SortOrder
  onSort?: TableOnSort
  columnSizes: TableColumnSizes
  onColumnResize?: TableOnColumnResize
  children?: React.ReactNode
  title?: string
}> {
  ref: HTMLElement

  onClick = () => {
    console.log('got a sort!')
    const { id, onSort, sortOrder } = this.props

    const direction =
      sortOrder && sortOrder.key === id && sortOrder.direction === 'down' ? 'up' : 'down'

    if (onSort) {
      onSort({
        direction,
        key: id,
      })
    }
  }

  onResize = (newWidth: number) => {
    const { id, columnSizes, onColumnResize, width } = this.props
    if (!onColumnResize) {
      return
    }

    let normalizedWidth: number | string = newWidth

    // normalise number to a percentage if we were originally passed a percentage
    if (isPercentage(width)) {
      const { parentElement } = this.ref
      invariant(parentElement, 'expected there to be parentElement')

      const parentWidth = parentElement.clientWidth
      const { childNodes } = parentElement

      const lastElem = childNodes[childNodes.length - 1]
      const right =
        lastElem instanceof HTMLElement ? lastElem.offsetLeft + lastElem.clientWidth + 1 : 0

      if (right < parentWidth) {
        normalizedWidth = calculatePercentage(parentWidth, newWidth)
      }
    }

    onColumnResize({
      ...columnSizes,
      [id]: normalizedWidth,
    })
  }

  setRef = (ref: HTMLElement) => {
    this.ref = ref
  }

  render() {
    const { isResizable, sortable, width, title } = this.props
    let { children } = this.props
    children = <TableHeaderColumnContainer>{children}</TableHeaderColumnContainer>

    if (isResizable) {
      children = (
        <TableHeaderColumnInteractive
          fill={true}
          resizable={RIGHT_RESIZABLE}
          onResize={this.onResize}
        >
          {children}
        </TableHeaderColumnInteractive>
      )
    }

    return (
      <TableHeadColumnContainer
        width={width}
        title={title}
        onClick={sortable === true ? this.onClick : undefined}
        ref={this.setRef}
      >
        {children}
      </TableHeadColumnContainer>
    )
  }
}

// this will:
//    1. if no flex provided, assume that strings should flex double anything else
//    2. if any flex provided, default rest to flex 1
//    3. calculate the percentage width based on flexes
function calculateColumnSizes(columns: DataColumns): TableColumnSizes {
  const values = Object.keys(columns).map(k => columns[k])
  const isUncontrolled = values.some(x => typeof x.flex !== 'undefined')
  const flexes = values.map(val => {
    if (isUncontrolled) {
      return !val.type || val.type === DataType.string ? 2 : 1
    } else {
      return val.flex || 1
    }
  })
  const totalFlex = flexes.reduce((a, flex) => a + flex, 0)
  const sizes = {}
  for (const key of Object.keys(columns)) {
    const flex = columns[key].flex
    sizes[key] = (flex / totalFlex) * 100
  }
  return sizes
}

export class TableHead extends React.PureComponent<
  {
    columnOrder: TableColumnOrder
    onColumnOrder?: (order: TableColumnOrder) => void
    columns: DataColumns
    sortOrder?: SortOrder
    onSort?: TableOnSort
    columnSizes?: TableColumnSizes
    onColumnResize?: TableOnColumnResize
  },
  { columnSizes: TableColumnSizes }
> {
  state = {
    columnSizes: this.props.columnSizes || calculateColumnSizes(this.props.columns),
  }

  static getDerivedStateFromProps(props) {
    const columnSizes = props.columnSizes || calculateColumnSizes(props.columns)
    return {
      columnSizes,
    }
  }

  buildContextMenu = (): any[] => {
    const visibles = this.props.columnOrder
      .map(c => (c.visible ? c.key : null))
      .filter(Boolean)
      .reduce((acc, cv) => {
        acc.add(cv)
        return acc
      }, new Set())
    return Object.keys(this.props.columns).map(key => {
      const visible = visibles.has(key)
      return {
        label: this.props.columns[key].value,
        click: () => {
          const { onColumnOrder, columnOrder } = this.props
          if (onColumnOrder) {
            const newOrder = columnOrder.slice()
            let hasVisibleItem = false
            for (let i = 0; i < newOrder.length; i++) {
              const info = newOrder[i]
              if (info.key === key) {
                newOrder[i] = { key, visible: !visible }
              }
              hasVisibleItem = hasVisibleItem || newOrder[i].visible
            }

            // Dont allow hiding all columns
            if (hasVisibleItem) {
              onColumnOrder(newOrder)
            }
          }
        },
        type: 'checkbox',
        checked: visible,
      }
    })
  }

  render() {
    const { columnOrder, columns, onColumnResize, onSort, sortOrder } = this.props
    const { columnSizes } = this.state
    const elems = []

    let hasFlex = false
    for (const column of columnOrder) {
      if (column.visible && columnSizes[column.key] === 'flex') {
        hasFlex = true
        break
      }
    }

    let lastResizable = true

    const colElems = {}
    for (const column of columnOrder) {
      if (!column.visible) {
        continue
      }

      const key = column.key
      const col = columns[key]

      let arrow
      if (col.sortable === true && sortOrder && sortOrder.key === key) {
        arrow = <TableHeaderArrow>{sortOrder.direction === 'up' ? '▲' : '▼'}</TableHeaderArrow>
      }

      const width = normaliseColumnWidth(columnSizes[key])
      const isResizable = col.resizable !== false

      const elem = (
        <TableHeadColumn
          key={key}
          id={key}
          hasFlex={hasFlex}
          isResizable={isResizable}
          leftHasResizer={lastResizable}
          width={width}
          sortable={col.sortable}
          sortOrder={sortOrder}
          onSort={onSort}
          columnSizes={columnSizes}
          onColumnResize={onColumnResize}
          title={key}
        >
          <TableHeadColumnText>{col.value}</TableHeadColumnText>
          {arrow}
        </TableHeadColumn>
      )

      elems.push(elem)

      colElems[key] = elem

      lastResizable = isResizable
    }

    return (
      <ContextMenu buildItems={this.buildContextMenu}>
        <TableHeadContainer>{elems}</TableHeadContainer>
      </ContextMenu>
    )
  }
}
