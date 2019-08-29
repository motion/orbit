import { VariableSizeList } from '@o/react-window'
import * as ReactWindow from '@o/react-window'
import { gloss } from 'gloss'
import React, { memo, RefObject } from 'react'
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
  listRef?: RefObject<DynamicListControlled>
}

export const DynamicList = memo(({ disableMeasure, ...props }: DynamicListProps) => {
  const { ref, width, height } = useNodeSize({
    disable: disableMeasure,
  })

  return (
    <DynamicListChrome nodeRef={ref}>
      <DynamicSizeList ref={props.listRef} width={width} height={height} {...props} />
    </DynamicListChrome>
  )
})

const DynamicListChrome = gloss(View, {
  overflow: 'hidden',
  flex: 1,
})

export type DynamicListControlled = VariableSizeList
