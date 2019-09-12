import { VariableSizeList } from '@o/react-window'
import * as ReactWindow from '@o/react-window'
import composeRefs from '@seznam/compose-react-refs'
import { gloss } from 'gloss'
import React, { forwardRef, memo, RefObject } from 'react'
import { VariableSizeListProps } from 'react-window'

import { useNodeSize } from '../hooks/useNodeSize'
import { View } from '../View/View'

// avoid type errors
const { DynamicSizeList } = ReactWindow as any

/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */
// @ts-ignore
export type DynamicListProps = Omit<VariableSizeListProps, 'itemSize' | 'height' | 'width'> & {
  height?: number
  width?: number
  disableMeasure?: boolean
  nodeRef?: any
}

export const DynamicList = memo(
  forwardRef(({ disableMeasure, nodeRef, ...props }: DynamicListProps, listRef) => {
    const { ref, width, height } = useNodeSize({
      disable: disableMeasure,
    })
    return (
      <DynamicListChrome nodeRef={composeRefs(ref, nodeRef)}>
        <DynamicSizeList ref={listRef} width={width} height={height} {...props} />
      </DynamicListChrome>
    )
  }),
)

const DynamicListChrome = gloss(View, {
  overflow: 'hidden',
  flex: 1,
})

export type DynamicListControlled = VariableSizeList
