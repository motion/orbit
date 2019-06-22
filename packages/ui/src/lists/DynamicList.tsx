/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */
import { gloss } from 'gloss'
import React, { forwardRef, memo, RefObject } from 'react'
import { DynamicSizeList, VariableSizeList, VariableSizeListProps } from 'react-window'

import { useNodeSize } from '../hooks/useNodeSize'
import { Omit } from '../types'
import { View } from '../View/View'
import { ItemMeasurer } from './ItemMeasurer'

// @ts-ignore
export type DynamicListProps = Omit<VariableSizeListProps, 'itemSize' | 'height' | 'width'> & {
  height?: number
  width?: number
  disableMeasure?: boolean
  listRef?: RefObject<DynamicListControlled>
}

export const DynamicList = memo(
  forwardRef(({ disableMeasure, ...props }: DynamicListProps, fwRef) => {
    const { ref, width, height } = useNodeSize({
      disable: disableMeasure,
    })

    return (
      <DynamicListChrome ref={ref}>
        <DynamicSizeList
          ItemMeasurer={ItemMeasurer}
          ref={props.listRef || fwRef}
          width={width}
          height={height}
          {...props}
        />
      </DynamicListChrome>
    )
  }),
)

const DynamicListChrome = gloss(View, {
  overflow: 'hidden',
  flex: 1,
})

export type DynamicListControlled = VariableSizeList
