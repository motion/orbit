import { gloss } from '@o/gloss'
import React, { useRef } from 'react'
import { useNodeSize } from './hooks/useNodeSize'
import { SliderProps } from './Slider'
import { View } from './View/View'
import { useVisibility } from './Visibility'

type SliderPaneProps = React.HTMLProps<HTMLDivElement> &
  Partial<SliderProps> & {
    index?: number
    width?: number
    onChangeHeight?: Function
    currentHeight?: number
    isActive?: boolean
    curFrame?: number
  }

export function SliderPane({
  children,
  onChangeHeight,
  width,
  fixHeightToTallest,
  currentHeight,
  verticalPad,
  framePad,
  isActive,
  curFrame,
  ...props
}: SliderPaneProps) {
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
      curFrame={curFrame}
      {...props}
    >
      {children}
    </SliderPaneChrome>
  )
}

const SliderPaneChrome = gloss(View, {
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
