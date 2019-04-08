/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import { gloss } from '@o/gloss'
import React, { forwardRef, RefObject } from 'react'
// @ts-ignore
import { DynamicSizeList, VariableSizeList, VariableSizeListProps } from 'react-window'
import { useNodeSize } from '../hooks/useNodeSize'
import { Omit } from '../types'
import { View } from '../View/View'

export type DynamicListProps = Omit<VariableSizeListProps, 'itemSize' | 'height' | 'width'> & {
  height?: number
  width?: number
  disableMeasure?: boolean
  listRef?: RefObject<DynamicListControlled>
}

export const DynamicList = forwardRef(({ disableMeasure, ...props }: DynamicListProps, fwRef) => {
  const { ref, width, height } = useNodeSize({
    disable: disableMeasure,
  })
  console.log('render dyn list..........')
  return (
    <DynamicListChrome flex={1} ref={ref}>
      <DynamicSizeList ref={props.listRef || fwRef} width={width} height={height} {...props} />
    </DynamicListChrome>
  )
})

const DynamicListChrome = gloss(View)

export type DynamicListControlled = VariableSizeList
