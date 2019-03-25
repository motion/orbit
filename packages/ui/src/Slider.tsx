import { gloss, View } from '@o/gloss'
import React, { cloneElement, isValidElement, memo, useRef, useState } from 'react'
import { useResizeObserver } from './hooks/useResizeObserver'

export type SliderProps = {
  curFrame: number
  children?: React.ReactNode
  framePad?: number
  verticalPad?: number
  fixHeightToTallest?: boolean
  transition?: string
}

export const Slider = memo(function Slider(props: SliderProps) {
  const {
    curFrame = 0,
    children,
    framePad = 0,
    verticalPad = 0,
    transition = 'transform ease 200ms, opacity ease 200ms',
    fixHeightToTallest,
    ...rest
  } = props
  const frameRef = useRef(null)
  const [width, setWidth] = useState(0)
  const [heights, setHeight] = useState([])
  let currentHeight = 0

  useResizeObserver({
    ref: frameRef,
    onChange: () => {
      const node = frameRef.current
      if (node.parentNode && node.parentNode.clientWidth !== width) {
        setWidth(node.parentNode.clientWidth)
      }
    },
  })

  if (fixHeightToTallest) {
    currentHeight = heights.reduce((a, b) => a + b, 0)
  } else {
    currentHeight = heights[curFrame]
  }

  return (
    <SliderContainer height={currentHeight} ref={frameRef} {...rest}>
      {React.Children.map(children, (child, index) => {
        if (!isValidElement(child)) {
          throw new Error(`Must pass <SliderPane /> to <Slider />`)
        }
        return cloneElement(child as any, {
          framePad,
          verticalPad,
          fixHeightToTallest,
          currentHeight,
          curFrame,
          isActive: curFrame === index,
          transition,
          width,
          index,
          onChangeHeight: (height: number) => {
            heights[index] = height
            setHeight(heights)
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
