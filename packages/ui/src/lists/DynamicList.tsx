/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import React, { forwardRef, RefObject } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
// @ts-ignore
import { DynamicSizeList, VariableSizeList, VariableSizeListProps } from 'react-window'
import { Omit } from '../types'
import { View } from '../View/View'

export type DynamicListProps = Omit<VariableSizeListProps, 'itemSize'> & {
  disableMeasure?: boolean
  listRef?: RefObject<DynamicListControlled>
}

export const DynamicList = forwardRef(({ disableMeasure, ...props }: DynamicListProps, ref) => {
  disableMeasure
  return (
    <View flex={1}>
      <AutoSizer>
        {({ width, height }) => {
          return (
            <DynamicSizeList
              ref={props.listRef || (ref as any)}
              width={width}
              height={height}
              {...props}
            />
          )
        }}
      </AutoSizer>
    </View>
  )
})

export type DynamicListControlled = VariableSizeList
