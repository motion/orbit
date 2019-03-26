import { gloss, View } from '@o/gloss'
import React, { useRef } from 'react'
import { useResizeObserver } from './hooks/useResizeObserver'
import { SliderProps } from './Slider'

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
  index,
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

  useResizeObserver({
    ref,
    onChange: entries => {
      if (onChangeHeight) {
        onChangeHeight(entries[0].contentRect.height)
      }
    },
  })

  return (
    <SliderPaneChrome
      width={width}
      height={fixHeightToTallest && currentHeight ? currentHeight : 'auto'}
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
