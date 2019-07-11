import { gloss } from 'gloss'
import React, { cloneElement, isValidElement, memo, useCallback, useRef, useState } from 'react'

import { useGet } from './hooks/useGet'
import { useParentNodeSize } from './hooks/useParentNodeSize'
import { SliderPane } from './SliderPane'
import { View } from './View/View'
import { useVisibility } from './Visibility'

export type SliderProps = {
  /** Index of Slider pane to show */
  curFrame: number

  /** Place <Slider.Pane /> inside here */
  children?: React.ReactNode

  /** Padding to add inside frame */
  framePad?: number

  /** Vertical padding inside frame */
  verticalPad?: number

  /** Measure and ensure height of slider stays equal to tallest child */
  fixHeightToTallest?: boolean

  /** Measure and ensure height of slider stays equal to parent node */
  fixHeightToParent?: boolean

  /** Define an animation for transitioning */
  transition?: string

  /** Define a height */
  height?: string

  /** Define a width */
  width?: string
}

export const Slider = memo((props: SliderProps) => {
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
  const [heights, setHeights] = useState([])
  let currentHeight = 0
  const visible = useVisibility()
  const getProps = useGet(props)
  const [numMounted, setNumMounted] = useState(React.Children.count(children))
  const handleDidMount = useCallback(() => {
    setNumMounted(React.Children.count(getProps().children))
  }, [])

  const size = useParentNodeSize({
    ref: frameRef,
    disable: !visible,
    throttle: 120,
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
        const isMounting = index > numMounted - 1
        const isActive = !isMounting && curFrame === index
        const onChangeHeight = (next: number) => {
          heights[index] = next
          setHeights(heights)
        }
        return cloneElement(child as any, {
          framePad,
          verticalPad,
          fixHeightToTallest,
          currentHeight: height,
          curFrame,
          isActive,
          transition,
          width,
          index,
          onChangeHeight,
          onMountChange: handleDidMount,
        })
      })}
    </SliderContainer>
  )
})

// @ts-ignore
Slider.Pane = SliderPane

const SliderContainer = gloss(View, {
  flex: 1,
  flexFlow: 'row',
  alignItems: 'flex-start',
  overflow: 'hidden',
  position: 'relative',
})
