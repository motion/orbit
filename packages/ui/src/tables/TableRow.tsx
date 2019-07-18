/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */
import { Color } from '@o/color'
import { useReaction } from '@o/use-store'
import { Box, gloss, ThemeObject } from 'gloss'
import React, { memo } from 'react'

import { DataValue } from '../DataValue'
import { CheckBox } from '../forms/CheckBox'
import { getRowValues } from '../helpers/getRowValues'
import { SelectableStore } from '../lists/SelectableStore'
import { useScale } from '../Scale'
import { DataColumns, GenericDataRow } from '../types'
import FilterRow from './FilterRow'
import { guesses, guessTheme } from './guessTheme'
import { DEFAULT_ROW_HEIGHT, TableColumnKeys, TableColumnSizes, TableOnAddFilter } from './types'
import { normaliseColumnWidth } from './utils'

type TableRowProps = {
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
  highlighted?: boolean
  row: GenericDataRow
  index: number
  style?: Object
  onAddFilter?: TableOnAddFilter
  zebra?: boolean
  selectableStore?: SelectableStore
  selectable?: boolean
  rowKey?: any
}

const reactionOpts = {
  name: 'TableRow.isHighlighted',
}

export const TableRow = memo(function TableRow({
  index,
  highlighted,
  row,
  multiline,
  columns,
  columnKeys,
  columnSizes,
  onAddFilter,
  selectableStore,
  rowKey,
  rowLineHeight = DEFAULT_ROW_HEIGHT,
  ...props
}: TableRowProps) {
  const lineHeight = rowLineHeight * useScale()
  const isHighlighted = useReaction(() => {
    return (selectableStore && selectableStore.active.has(rowKey)) || false
  }, reactionOpts)

  if (!columnKeys.length) {
    console.warn('No columns')
  }

  return (
    <TableBodyRowContainer
      highlighted={highlighted || isHighlighted}
      even={index % 2 === 0}
      highlightOnHover={row.highlightOnHover}
      data-key={row.key}
      rowLineHeight={lineHeight}
      {...row.style}
      {...props}
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

        if (col.type === 'boolean') {
          element = (
            <CheckBox
              checked={value}
              onChange={next => {
                if (col.onChange) {
                  col.onChange(index, next)
                } else {
                  console.warn(`No onChange event passed to table column ${key}`)
                }
              }}
            />
          )
        } else {
          element = <DataValue type={col.type} value={value} />
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
})

const backgroundColor = (props: TableRowProps, theme: ThemeObject) => {
  if (props.background) {
    return props.background
  }
  const isZebra = props.even && props.zebra
  if (props.highlighted) {
    if (!props.background && props.row) {
      const cat = props.row.category
      if (cat && guesses[cat]) {
        return guessTheme(cat, theme).background || 'transparent'
      }
    }
    return theme.backgroundHighlight
  }
  if (isZebra) {
    return theme.backgroundZebra
  } else {
    return theme.background.setAlpha(0.35)
  }
}

const getColor = (props: TableRowProps, theme: ThemeObject) => {
  let color = props.color
  if (props.row) {
    const cat = props.row.category
    if (guesses[cat]) {
      color = color || guessTheme(cat, theme).color
    }
  }
  return color || 'inherit'
}

const TableBodyRowContainer = gloss<TableRowProps>(Box, {
  flexFlow: 'row',
  fontWeight: 'inherit',
  overflow: 'hidden',
  width: '100%',
  userSelect: 'none',
}).theme((props, theme) => {
  const background = backgroundColor(props, theme)
  console.log('background', background.toString())
  return {
    background,
    boxShadow: props.zebra ? 'none' : `inset 0 -1px ${theme.borderColor.setAlpha(0.35)}`,
    color: props.highlighted ? theme.colorHighlight : getColor(props, theme),
    '& *': {
      color: props.highlighted ? `${theme.colorHighlight} !important` : null,
    },
    '& img': {
      background: props.highlighted ? `${theme.colorHighlight} !important` : 'none',
    },
    height: props.multiline ? 'auto' : props.rowLineHeight,
    lineHeight: `${String(props.rowLineHeight)}px`,
    flexShrink: 0,
    '&:hover': {
      background: typeof background === 'string' ? background : lightenRelative(background, 0.1),
    },
  }
})

const lightenRelative = (color: Color, pct: number) => {
  console.log(color.toString(), color.lightness(), color.getAlpha())
  return color
    .lighten(pct)
    .saturate(pct)
    .setAlpha(1)
  return color
}

const TableBodyColumnContainer = gloss<any>(Box, {
  overflow: 'hidden',
  padding: [0, 8],
  userSelect: 'none',
  maxWidth: '100%',
  justifyContent: 'center',
}).theme(props => ({
  flexShrink: props.width === 'flex' ? 1 : 0,
  whiteSpace: props.multiline ? 'normal' : 'nowrap',
  wordWrap: props.multiline ? 'break-word' : 'normal',
  width: props.width === 'flex' ? '100%' : props.width,
}))
