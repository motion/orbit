/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import { view } from '@mcro/black'
import * as React from 'react'
import {
  TableColumnKeys,
  TableColumnOrder,
  TableColumnSizes,
  TableColumns,
  TableOnColumnResize,
  TableOnSort,
  TableRowSortOrder,
} from './types'
import { normaliseColumnWidth, isPercentage } from './utils'
// import ContextMenu from '../ContextMenu.js'
import { Interactive } from '../Interactive'
import { colors } from '../helpers/colors'
import { Row } from '../blocks/Row'

const invariant = require('invariant')

const TableHeaderArrow = view({
  display: 'block',
  float: 'right',
  fontSize: '75%',
  opacity: 0.6,
})

const TableHeaderColumnInteractive = view(Interactive, {
  display: 'inline-block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  width: '100%',
})

const TableHeaderColumnContainer = view({
  flexFlow: 'row',
  padding: '0 8px',
})

const TableColumnText = view({
  flex: 1,
  maxWidth: '100%',
  display: 'block',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
})

const TableHeadContainer = view(Row, {
  borderBottom: `1px solid ${colors.sectionHeaderBorder}`,
  color: colors.light50,
  flexShrink: 0,
  left: 0,
  overflow: 'hidden',
  position: 'sticky',
  right: 0,
  textAlign: 'left',
  top: 0,
  zIndex: 2,
})

const TableHeadColumnContainer = view({
  flexFlow: 'row',
  justifyContent: 'space-between',
  position: 'relative',
  backgroundColor: colors.white,
  height: 23,
  lineHeight: '23px',
  fontSize: '0.85em',
  fontWeight: 500,
  userSelect: 'none',
  '&::after': {
    position: 'absolute',
    content: '""',
    right: 0,
    top: 5,
    height: 13,
    width: 1,
    background: colors.light15,
  },
  '&:last-child::after': {
    display: 'none',
  },
})

TableHeadColumnContainer.theme = ({ width }) => ({
  flexShrink: width === 'flex' ? 1 : 0,
  width: width === 'flex' ? '100%' : width,
})

const RIGHT_RESIZABLE = { right: true }

function calculatePercentage(parentWidth: number, selfWidth: number): string {
  return `${(100 / parentWidth) * selfWidth}%`
}

class TableHeadColumn extends React.PureComponent<{
  id: string
  width: string | number
  sortable: boolean | undefined
  isResizable: boolean
  leftHasResizer: boolean
  hasFlex: boolean
  sortOrder: TableRowSortOrder | undefined
  onSort: TableOnSort | undefined
  columnSizes: TableColumnSizes
  onColumnResize: TableOnColumnResize | undefined
  children?: any
  title?: string
}> {
  ref: HTMLElement

  onClick = () => {
    const { id, onSort, sortOrder } = this.props

    const direction =
      sortOrder && sortOrder.key === id && sortOrder.direction === 'down'
        ? 'up'
        : 'down'

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

    let normalizedWidth: string | number = newWidth

    // normalise number to a percentage if we were originally passed a percentage
    if (isPercentage(width)) {
      const { parentElement } = this.ref
      invariant(parentElement, 'expected there to be parentElement')

      const parentWidth = parentElement.clientWidth
      const { childNodes } = parentElement

      const lastElem = childNodes[childNodes.length - 1]
      const right =
        lastElem instanceof HTMLElement
          ? lastElem.offsetLeft + lastElem.clientWidth + 1
          : 0

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
    children = (
      <TableHeaderColumnContainer>{children}</TableHeaderColumnContainer>
    )

    if (isResizable) {
      children = (
        <TableHeaderColumnInteractive
          debug
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
        forwardRef={this.setRef}
      >
        {children}
      </TableHeadColumnContainer>
    )
  }
}

export default class TableHead extends React.PureComponent<{
  columnOrder: TableColumnOrder
  onColumnOrder: (order: TableColumnOrder) => void | undefined
  columnKeys: TableColumnKeys
  columns: TableColumns
  sortOrder: TableRowSortOrder | undefined
  onSort: TableOnSort | undefined
  columnSizes: TableColumnSizes
  onColumnResize: TableOnColumnResize | undefined
}> {
  buildContextMenu = () => {
    return Object.keys(this.props.columns).map(key => {
      const visible = this.props.columnKeys.includes(key)
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
    const {
      columnOrder,
      columns,
      columnSizes,
      onColumnResize,
      onSort,
      sortOrder,
    } = this.props
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
        arrow = (
          <TableHeaderArrow>
            {sortOrder.direction === 'up' ? '▲' : '▼'}
          </TableHeaderArrow>
        )
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
          <TableColumnText>{col.value}</TableColumnText>
          {arrow}
        </TableHeadColumn>
      )

      elems.push(elem)

      colElems[key] = elem

      lastResizable = isResizable
    }

    return (
      // <ContextMenu buildItems={this.buildContextMenu}>
      <TableHeadContainer>{elems}</TableHeadContainer>
      // </ContextMenu>
    )
  }
}
