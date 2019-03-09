/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import { gloss, Row, SimpleText } from '@o/gloss'
import * as React from 'react'
import { CheckboxReactive } from '../forms/CheckboxReactive'
import { DateFormat } from '../text/DateFormat'
import { GenericDataRow } from '../types'
import FilterRow from './FilterRow'
import {
  DEFAULT_ROW_HEIGHT,
  TableColumnKeys,
  TableColumns,
  TableColumnSizes,
  TableOnAddFilter,
} from './types'
import { normaliseColumnWidth } from './utils'

const backgroundColor = (props, theme) => {
  if (props.highlighted) {
    if (props.highlightedBackgroundColor) {
      return props.highlightedBackgroundColor
    } else {
      return theme.highlightBackground
    }
  } else {
    if (props.backgroundColor) {
      return props.backgroundColor
    } else if (props.even && props.zebra) {
      return theme.backgroundAlternate
    } else {
      return 'transparent'
    }
  }
}

const TableBodyRowContainer = gloss(Row, {
  overflow: 'hidden',
  width: '100%',
  userSelect: 'none',
}).theme((props, theme) => ({
  backgroundColor: backgroundColor(props, theme),
  boxShadow: props.zebra ? 'none' : 'inset 0 -1px #E9EBEE',
  color: props.highlighted ? theme.white : props.color || 'inherit',
  '& *': {
    color: props.highlighted ? `${theme.white} !important` : null,
  },
  '& img': {
    backgroundColor: props.highlighted ? `${theme.white} !important` : 'none',
  },
  height: props.multiline ? 'auto' : props.rowLineHeight,
  lineHeight: `${String(props.rowLineHeight || DEFAULT_ROW_HEIGHT)}px`,
  fontWeight: props.fontWeight || 'inherit',
  flexShrink: 0,
  '&:hover': {
    backgroundColor:
      !props.highlighted && props.highlightOnHover ? theme.backgroundAlternate : 'none',
  },
}))

const TableBodyColumnContainer = gloss({
  overflow: 'hidden',
  padding: [0, 8],
  userSelect: 'none',
  maxWidth: '100%',
}).theme(props => ({
  flexShrink: props.width === 'flex' ? 1 : 0,
  whiteSpace: props.multiline ? 'normal' : 'nowrap',
  wordWrap: props.multiline ? 'break-word' : 'normal',
  width: props.width === 'flex' ? '100%' : props.width,
}))

type Props = {
  columnKeys: TableColumnKeys
  columnSizes: TableColumnSizes
  columns: TableColumns
  onMouseDown: (e: React.MouseEvent) => any
  onMouseEnter?: (e: React.MouseEvent) => void
  multiline?: boolean
  rowLineHeight: number
  highlighted: boolean
  row: GenericDataRow
  index: number
  style?: Object
  onAddFilter?: TableOnAddFilter
  zebra?: boolean
}

export class TableRow extends React.PureComponent<Props> {
  static defaultProps = {
    zebra: true,
  }

  render() {
    const {
      index,
      highlighted,
      rowLineHeight,
      row,
      style,
      multiline,
      columns,
      columnKeys,
      columnSizes,
      onMouseEnter,
      onMouseDown,
      zebra,
      onAddFilter,
    } = this.props
    return (
      <TableBodyRowContainer
        rowLineHeight={rowLineHeight}
        highlightedBackgroundColor={row.highlightedBackgroundColor}
        backgroundColor={row.backgroundColor}
        highlighted={highlighted}
        multiline={multiline}
        even={index % 2 === 0}
        zebra={zebra}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        style={style}
        highlightOnHover={row.highlightOnHover}
        data-key={row.key}
        {...row.style}
      >
        {columnKeys.map(key => {
          const value = row.values[key]
          const col = columns[key]
          // TODO we could let them configure but seems weird, when do they want an "unfilterable" row?
          const isFilterable = true

          if (col == null) {
            throw new Error(
              `Trying to access column "${key}" which does not exist on row. Make sure buildRow is returning a valid row.`,
            )
          }

          let element: React.ReactNode = null

          if (col.type === 'date') {
            element = (
              <SimpleText ellipse>
                <DateFormat date={value} />
              </SimpleText>
            )
          } else if (col.type === 'boolean') {
            element = <CheckboxReactive isActive={() => value} />
          } else {
            element = <SimpleText>{value}</SimpleText>
          }

          if (isFilterable && onAddFilter != null) {
            element = (
              <FilterRow addFilter={onAddFilter} filterKey={key}>
                {element}
              </FilterRow>
            )
          }

          return (
            <TableBodyColumnContainer
              key={key}
              multiline={multiline}
              width={normaliseColumnWidth(columnSizes[key])}
            >
              {element}
            </TableBodyColumnContainer>
          )
        })}
      </TableBodyRowContainer>
    )
  }
}
