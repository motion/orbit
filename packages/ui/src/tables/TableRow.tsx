/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import { Color } from '@o/color'
import { gloss, Row, SimpleText, ThemeObject } from '@o/gloss'
import * as React from 'react'
import { CheckboxReactive } from '../forms/CheckboxReactive'
import { getRowValues } from '../helpers/getRowValues'
import { DateFormat } from '../text/DateFormat'
import { DataColumns, GenericDataRow } from '../types'
import FilterRow from './FilterRow'
import { guesses, guessTheme } from './guessTheme'
import { DEFAULT_ROW_HEIGHT, TableColumnKeys, TableColumnSizes, TableOnAddFilter } from './types'
import { normaliseColumnWidth } from './utils'

const backgroundColor = (props: Props, theme: ThemeObject) => {
  if (props.highlighted) {
    if (props.highlightedBackgroundColor) {
      return props.highlightedBackgroundColor
    } else {
      return theme.highlightBackground
    }
  } else {
    if (!props.background && props.row) {
      const cat = props.row.category
      if (cat && guesses[cat]) {
        return guessTheme(cat, theme).background || 'transparent'
      }
    }
    if (props.background) {
      return props.background
    } else if (props.even && props.zebra) {
      return theme.backgroundZebra || theme.backgroundAlt
    } else {
      return 'transparent'
    }
  }
}

const getColor = (props: Props, theme: ThemeObject) => {
  let color = props.color
  if (props.row) {
    const cat = props.row.category
    if (guesses[cat]) {
      color = color || guessTheme(cat, theme).color
    }
  }
  return color || 'inherit'
}

const TableBodyRowContainer = gloss(Row, {
  overflow: 'hidden',
  width: '100%',
  userSelect: 'none',
}).theme((props, theme) => ({
  background: backgroundColor(props, theme),
  boxShadow: props.zebra ? 'none' : 'inset 0 -1px #E9EBEE',
  color: props.highlighted ? theme.colorHighlight : getColor(props, theme),
  '& *': {
    color: props.highlighted ? `${theme.colorHighlight} !important` : null,
  },
  '& img': {
    background: props.highlighted ? `${theme.colorHighlight} !important` : 'none',
  },
  height: props.multiline ? 'auto' : props.rowLineHeight,
  lineHeight: `${String(props.rowLineHeight || DEFAULT_ROW_HEIGHT)}px`,
  fontWeight: props.fontWeight || 'inherit',
  flexShrink: 0,
  // '&:hover': {
  //   background: !props.highlighted && props.highlightOnHover ? theme.backgroundAlt : 'none',
  // },
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
  color?: Color
  even?: boolean
  background?: Color
  highlightedBackgroundColor?: Color
  columnKeys: TableColumnKeys
  columnSizes: TableColumnSizes
  columns: DataColumns
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
        {...this.props}
        rowLineHeight={rowLineHeight}
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
          const value = getRowValues(row)[key]
          const col = columns[key]

          // TODO we could let them configure but seems weird, when do you want an "unfilterable" row?
          const isFilterable = true

          if (col == null) {
            throw new Error(
              `Trying to access column "${key}" which does not exist on row. Make sure buildRow is returning a valid row.`,
            )
          }

          let element: React.ReactNode = null

          if (col.type === 'date') {
            element = (
              <SimpleText alpha={0.7} ellipse>
                <DateFormat date={value} />
              </SimpleText>
            )
          } else if (col.type === 'boolean') {
            element = (
              <CheckboxReactive
                isActive={() => value}
                onChange={next => {
                  if (col.onChange) {
                    col.onChange(index, next)
                  } else {
                    console.warn(`No onChange event passed to table column ${key}`)
                  }
                }}
              />
            )
          } else if (col.type === 'string') {
            element = <SimpleText alpha={0.7}>{value}</SimpleText>
          } else {
            element = <SimpleText alpha={0.7}>{`${value}`}</SimpleText>
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
