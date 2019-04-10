import { gloss } from '@o/gloss'
import React, { cloneElement, isValidElement, memo, useRef, useState } from 'react'
import { useParentNodeSize } from './hooks/useParentNodeSize'
import { View } from './View/View'
import { useVisibility } from './Visibility'

export type SliderProps = {
  curFrame: number
  children?: React.ReactNode
  framePad?: number
  verticalPad?: number
  fixHeightToTallest?: boolean
  fixHeightToParent?: boolean
  transition?: string
  height?: string
  width?: string
}

export const Slider = memo(function Slider(props: SliderProps) {
  const {
    curFrame = 0,
    children,
    framePad = 0,
    verticalPad = 0,
    transition = 'transform ease 200ms, opacity ease 200ms',
    fixHeightToTallest,
    fixHeightToParent,
    ...rest
  } = props
  const frameRef = useRef(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [heights, setHeights] = useState([])
  let currentHeight = 0
  const visible = useVisibility()

  useParentNodeSize({
    ref: frameRef,
    disable: !visible,
    throttle: 200,
    onChange: setSize,
  })

  if (fixHeightToParent) {
    currentHeight = size.height
  } else {
    if (fixHeightToTallest) {
      currentHeight = heights.reduce((a, b) => a + b, 0)
    } else {
      currentHeight = heights[curFrame]
    }
  }

  const width = rest.width || size.width
  const height = rest.height || currentHeight

  return (
    <SliderContainer height={height} ref={frameRef} {...rest}>
      {React.Children.map(children, (child, index) => {
        if (!isValidElement(child)) {
          throw new Error(`Must pass <SliderPane /> to <Slider />`)
        }
        return cloneElement(child as any, {
          framePad,
          verticalPad,
          fixHeightToTallest,
          currentHeight: height,
          curFrame,
          isActive: curFrame === index,
          transition,
          width: width,
          index,
          onChangeHeight: (next: number) => {
            heights[index] = next
            setHeights(heights)
          },
        })
      })}
    </SliderContainer>
  )
})

const SliderContainer = gloss(View, {
  flex: 1,
  flexFlow: 'row',
  alignItems: 'flex-start',
  overflow: 'hidden',
  position: 'relative',
})
