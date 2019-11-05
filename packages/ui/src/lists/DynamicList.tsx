import { VariableSizeList } from '@o/react-window'
import * as ReactWindow from '@o/react-window'
import React, { forwardRef, memo, RefObject } from 'react'
import { VariableSizeListProps } from 'react-window'

import { useNodeSize } from '../hooks/useNodeSize'

// avoid type errors
const { DynamicSizeList } = ReactWindow as any

/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

export type DynamicListProps = Omit<VariableSizeListProps, 'itemSize' | 'height' | 'width'> & {
  height?: number
  width?: number
  disableMeasure?: boolean
  measureKey?: any
}

export const DynamicList = memo(
  forwardRef(({ disableMeasure, measureKey, ...props }: DynamicListProps, listRef) => {
    const { ref, width, height } = useNodeSize(
      {
        disable: disableMeasure,
      },
      [measureKey],
    )
    // console.log('list height', height, ref)
    return (
      <div data-is="DynamicListChrome" ref={ref as any} style={{ overflow: 'hidden', flex: 1 }}>
        <DynamicSizeList ref={listRef} width={width} height={height} {...props} />
      </div>
    )
  }),
)

export type DynamicListControlled = VariableSizeList
