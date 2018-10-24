import * as React from 'react'
import { view } from '@mcro/black'
import { ORBIT_WIDTH } from '@mcro/constants'
import { View } from '@mcro/ui'

const framePad = 30
const frameWidth = ORBIT_WIDTH
const controlsHeight = 50

const SliderPaneContainer = view(View, {
  position: 'relative',
  width: frameWidth,
  minHeight: 300,
  padding: [20, framePad, 20 + controlsHeight],
})

const SliderContainer = view(View, {
  flexFlow: 'row',
  transition: 'all ease 200ms',
}).theme(({ curFrame, numFrames }) => ({
  width: frameWidth * numFrames,
  '& > div': {
    transition: 'all ease-in 500ms',
    opacity: 0,
  },
  [`& > div:nth-child(${curFrame + 1})`]: {
    opacity: 1,
  },
  transform: {
    x: -frameWidth * curFrame,
  },
}))

export const Slider = ({ curFrame = 0, numFrames = 0, children, ...props }) => {
  return (
    <SliderContainer
      curFrame={curFrame}
      numFrames={numFrames || React.Children.count(children)}
      {...props}
    >
      {children}
    </SliderContainer>
  )
}

export const SliderPane = ({ children, ...props }) => {
  return <SliderPaneContainer {...props}>{children}</SliderPaneContainer>
}
