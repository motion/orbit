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
  transition?: string
}

const SliderPaneContainer = view(View, {
  position: 'relative',
  minHeight: 50,
})

const SliderContainer = view(View, {
  flexFlow: 'row',
  alignItems: 'flex-start',
  overflow: 'hidden',
}).theme(({ frameWidth, curFrame, numFrames }) => ({
  width: frameWidth * numFrames,
  '& > div': {
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
    transition = 'transform ease 200ms, opacity ease 200ms',
    ...props
  }: SliderProps & { store?: SliderStore }) => {
    return (
      <SliderContainer
        height={store.height}
        curFrame={curFrame}
        numFrames={React.Children.count(children)}
        frameWidth={frameWidth}
        transition={transition}
        {...props}
      >
        {React.Children.map(children, (child, index) =>
          React.cloneElement(child as React.ReactElement<any>, {
            store,
            index,
          }),
        )}
      </SliderContainer>
    )
  },
)

export const SliderPane = ({
  children,
  index,
  store,
  ...props
}: { store?: SliderStore; index?: number; children?: React.ReactNode } & React.HTMLProps<
  HTMLDivElement
>) => {
  return (
    <SliderPaneContainer
      width={store.props.frameWidth}
      height={store.props.fixHeightToTallest && store.height ? store.height : 'auto'}
      forwardRef={store.setRef(index)}
      padding={[store.props.verticalPad, store.props.framePad, store.props.verticalPad]}
      {...props}
    >
      {children}
    </SliderPaneContainer>
  )
}
