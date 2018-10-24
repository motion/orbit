import * as React from 'react'
import { view, compose, react } from '@mcro/black'
import { ORBIT_WIDTH } from '@mcro/constants'
import { View } from '@mcro/ui'
import { memoize } from 'lodash'

const framePad = 30
const frameWidth = ORBIT_WIDTH
const controlsHeight = 50

const SliderPaneContainer = view(View, {
  position: 'relative',
  width: frameWidth,
  minHeight: 100,
  padding: [20, framePad, 20 + controlsHeight],
})

const SliderContainer = view(View, {
  flexFlow: 'row',
  transition: 'transform ease 200ms, opacity ease 200ms',
  alignItems: 'flex-start',
  overflow: 'hidden',
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

type Props = {
  curFrame: number
  children?: React.ReactElement<any>[]
}

class SliderStore {
  props: Props
  height = 0
  refs = []

  setRef = memoize(index => ref => {
    this.refs[index] = ref
  })

  updateHeight = react(
    () => [this.props.curFrame, this.refs],
    ([index]) => {
      console.log('refs', this.refs)
      if (this.refs[index]) {
        this.height = this.refs[index].clientHeight || 100
      }
    },
  )
}

const decorate = compose(
  view.attach({
    store: SliderStore,
  }),
  view,
)
export const Slider = decorate(
  ({ curFrame = 0, children, store, ...props }: Props & { store: SliderStore }) => {
    return (
      <SliderContainer
        height={store.height}
        curFrame={curFrame}
        numFrames={React.Children.count(children)}
        {...props}
      >
        {React.Children.map(children, (child, index) =>
          React.cloneElement(child as React.ReactElement<any>, { forwardRef: store.setRef(index) }),
        )}
      </SliderContainer>
    )
  },
)

export const SliderPane = ({ children, ...props }) => {
  return <SliderPaneContainer {...props}>{children}</SliderPaneContainer>
}
