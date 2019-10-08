/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */
import { Color } from '@o/color'
import { useReaction } from '@o/use-store'
import { Box, BoxProps, gloss, ThemeFn } from 'gloss'
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

const backgroundTheme: ThemeFn<TableRowProps> = props => {
  let background
  if (props.background) {
    background = props.background
  } else {
    const isZebra = props.even && props.zebra
    if (props.highlighted) {
      if (!props.background && props.row) {
        const cat = props.row.category
        if (cat && guesses[cat]) {
          background = guessTheme(cat, props).background || 'transparent'
        }
      } else {
        background = props.backgroundHighlight
      }
    } else if (isZebra) {
      background = props.backgroundZebra
    } else {
      background = props.background.setAlpha(0.35)
    }
  }
  return {
    background,
    '&:hover': {
      background: typeof background === 'string' ? background : background.lighten(0.075, true),
    },
  }
}

const colorTheme: ThemeFn<TableRowProps> = props => {
  let color = props.color
  if (props.highlighted) {
    color = props.colorHighlight
  } else if (props.row) {
    const cat = props.row.category
    if (guesses[cat]) {
      color = color || guessTheme(cat, props).color
    }
  }
  return { color: color || 'inherit' }
}

const TableBodyRowContainer = gloss<TableRowProps, BoxProps>(Box, {
  flexDirection: 'row',
  fontWeight: 'inherit',
  overflow: 'hidden',
  width: '100%',
  userSelect: 'none',
}).theme(backgroundTheme, colorTheme, props => {
  return {
    boxShadow: props.zebra ? 'none' : ['inset', 0, -1, props.borderColorLight],
    '& *': {
      color: props.highlighted ? `${props.colorHighlight.toCSS()} !important` : null,
    },
    '& img': {
      background: props.highlighted ? `${props.colorHighlight.toCSS()} !important` : 'none',
    },
    height: props.multiline ? 'auto' : props.rowLineHeight,
    lineHeight: `${String(props.rowLineHeight)}px`,
    flexShrink: 0,
  }
})

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
