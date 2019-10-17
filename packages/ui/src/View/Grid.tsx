import { px } from '@o/css'
import { isDefined } from '@o/utils'
import { Flex } from 'gloss'
import React from 'react'

import { getSpaceSize, Size } from '../Space'
import { Stack, StackProps } from './Stack'

export type GridProps = StackProps & {
  columnSpace?: Size
  rowSpace?: Size
  itemMinWidth?: number | string
  itemMaxWidth?: number | string
  itemMinHeight?: number | string
  itemMaxHeight?: number | string
  gap?: number | string
}

export const Grid = (props: GridProps) => (
  <Stack data-is="Grid" display="grid" width="100%" {...sizeGaps(autoGridLayout(props))} />
)

// for gloss parents
Grid.ignoreAttrs = Flex.ignoreAttrs
Grid.acceptsSpacing = true

// Transforms gap sizing props to numbers

function sizeGaps(props: GridProps) {
  let { space, columnSpace, rowSpace } = props
  let extra = props
  if (space) {
    extra = { gridGap: getSpaceSize(space), ...extra, space: undefined }
  }
  if (columnSpace) {
    extra = { gridColumnGap: getSpaceSize(columnSpace), ...extra }
  }
  if (rowSpace) {
    extra = { gridRowGap: getSpaceSize(rowSpace), ...extra }
  }
  return extra
}

function autoGridLayout(props: GridProps) {
  let extra = props
  if (isDefined(props.itemMinWidth, props.itemMaxWidth)) {
    extra = {
      gridTemplateColumns: `repeat(
        auto-fit,
        minmax(
          ${px(props.itemMinWidth || 100)},
          ${px(props.itemMaxWidth || '1fr')}
        )
      )`,
      ...extra,
    }
  }
  if (isDefined(props.itemMinHeight, props.itemMaxHeight)) {
    extra = {
      gridTemplateRows: `repeat(
        100000,
        ${px(props.itemMinHeight || 100)},
        [col-start]
      )`,
      ...extra,
    }
  }
  return extra
}
