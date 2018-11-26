import * as React from 'react'
import { view, compose, react, attach } from '@mcro/black'
import { View } from '@mcro/ui'
import { memoize } from 'lodash'

type SliderProps = {
  frameWidth: number
  curFrame: number
  children?: React.ReactElement<any>[]
  framePad?: number
  verticalPad?: number
  fixHeightToTallest?: boolean
}

const SliderPaneContainer = view(View, {
  position: 'relative',
  minHeight: 50,
})

const SliderContainer = view(View, {
  flexFlow: 'row',
  transition: 'transform ease 200ms, opacity ease 200ms',
  alignItems: 'flex-start',
  overflow: 'hidden',
}).theme(({ frameWidth, curFrame, numFrames }) => ({
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

class SliderStore {
  props: SliderProps
  height = 0
  refs = []

  setRef = memoize(index => ref => {
    this.refs[index] = ref
  })

  updateHeight = react(
    () => [this.props.curFrame, this.refs],
    ([index]) => {
      if (this.props.fixHeightToTallest) {
        let tallest = 0
        for (const ref of this.refs) {
          if (ref.clientHeight > tallest) {
            tallest = ref.clientHeight
          }
        }
        this.height = tallest
        return
      }
      if (this.refs[index]) {
        this.height = this.refs[index].clientHeight || 100
      }
    },
  )
}

const decorate = compose(
  attach({
    store: SliderStore,
  }),
  view,
)
export const Slider = decorate(
  ({
    curFrame = 0,
    children,
    store,
    frameWidth,
    framePad = 0,
    verticalPad = 0,
    ...props
  }: SliderProps & { store?: SliderStore }) => {
    return (
      <SliderContainer
        height={store.height}
        curFrame={curFrame}
        numFrames={React.Children.count(children)}
        frameWidth={frameWidth}
        {...props}
      >
        {React.Children.map(children, (child, index) =>
          React.cloneElement(child as React.ReactElement<any>, {
            forwardRef: store.setRef(index),
            frameWidth,
            framePad,
            verticalPad,
          }),
        )}
      </SliderContainer>
    )
  },
)

export const SliderPane = ({
  children,
  verticalPad = 0,
  frameWidth = 0,
  framePad = 0,
  ...props
}) => {
  return (
    <SliderPaneContainer
      width={frameWidth}
      padding={[verticalPad, framePad, verticalPad]}
      {...props}
    >
      {children}
    </SliderPaneContainer>
  )
}
