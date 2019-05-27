import { gloss } from 'gloss'
import React, { memo, useRef } from 'react'

import { useNodeSize } from './hooks/useNodeSize'
import { SliderProps } from './Slider'
import { Col, ColProps } from './View/Col'
import { useVisibility } from './Visibility'

type SliderPaneProps = ColProps &
  Partial<SliderProps> & {
    index?: number
    width?: number
    onChangeHeight?: Function
    currentHeight?: number
    isActive?: boolean
    curFrame?: number
  }

export const SliderPane = memo(
  ({
    children,
    onChangeHeight,
    width,
    fixHeightToTallest,
    currentHeight,
    verticalPad,
    framePad,
    isActive,
    ...props
  }: SliderPaneProps) => {
    const ref = useRef(null)
    const visiblity = useVisibility()

    useNodeSize({
      disable: !visiblity,
      throttle: 200,
      ref,
      onChange({ height }) {
        if (onChangeHeight) {
          onChangeHeight(height)
        }
      },
    })

    return (
      <SliderPaneChrome
        width={width}
        height={fixHeightToTallest && currentHeight ? currentHeight : '100%'}
        ref={ref}
        padding={[verticalPad, framePad, verticalPad]}
        isActive={isActive}
        {...props}
      >
        {children}
      </SliderPaneChrome>
    )
  },
)

const SliderPaneChrome = gloss<ColProps & { isActive?: boolean }>(Col, {
  position: 'absolute',
  top: 0,
  left: 0,
  minHeight: 50,
  pointerEvents: 'none',
  opacity: 0,
  transform: {
    x: 20,
  },
  isActive: {
    pointerEvents: 'inherit',
    opacity: 1,
    transform: {
      x: 0,
    },
  },
})
