import { gloss, View } from '@o/gloss'
import * as React from 'react'
import { useResizeObserver } from './hooks/useResizeObserver'

type SliderProps = {
  curFrame: number
  children?: React.ReactNode
  framePad?: number
  verticalPad?: number
  fixHeightToTallest?: boolean
  transition?: string
}

export const Slider = React.memo(function Slider(props: SliderProps) {
  const {
    curFrame = 0,
    children,
    framePad = 0,
    verticalPad = 0,
    transition = 'transform ease 200ms, opacity ease 200ms',
    fixHeightToTallest,
    ...rest
  } = props
  const numFrames = React.Children.count(children)
  const frameRef = React.useRef(null)
  const [width, setWidth] = React.useState(0)
  const [heights, setHeight] = React.useState([])
  let currentHeight = 0

  const node = frameRef.current

  useResizeObserver(frameRef, () => {
    if (node.parentNode && node.parentNode.clientWidth !== width) {
      setWidth(node.parentNode.clientWidth)
    }
  })

  if (fixHeightToTallest) {
    currentHeight = heights.reduce((a, b) => a + b, 0)
  } else {
    currentHeight = heights[curFrame]
  }

  return (
    <SliderContainer
      width={width * numFrames}
      frameWidth={width}
      height={currentHeight}
      curFrame={curFrame}
      transition={transition}
      ref={frameRef}
      {...rest}
    >
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child as React.ReactElement<any>, {
          framePad,
          verticalPad,
          fixHeightToTallest,
          currentHeight,
          width,
          index,
          onChangeHeight: (height: number) => {
            heights[index] = height
            setHeight(heights)
          },
        }),
      )}
    </SliderContainer>
  )
})

type SliderPaneProps = React.HTMLProps<HTMLDivElement> &
  Partial<SliderProps> & {
    index?: number
    width?: number
    onChangeHeight?: Function
    currentHeight?: number
  }

export const SliderPane = ({
  children,
  index,
  onChangeHeight,
  width,
  fixHeightToTallest,
  currentHeight,
  verticalPad,
  framePad,
  ...props
}: SliderPaneProps) => {
  // height management
  const ref = React.useRef(null)
  useResizeObserver(ref.current, entries => {
    if (onChangeHeight) {
      onChangeHeight(entries[0].contentRect.height)
    }
  })

  return (
    <SliderPaneContainer
      width={width}
      height={fixHeightToTallest && currentHeight ? currentHeight : 'auto'}
      ref={ref}
      padding={[verticalPad, framePad, verticalPad]}
      {...props}
    >
      {children}
    </SliderPaneContainer>
  )
}

const SliderPaneContainer = gloss(View, {
  position: 'relative',
  minHeight: 50,
})

const SliderContainer = gloss(View, {
  flex: 1,
  flexFlow: 'row',
  alignItems: 'flex-start',
  overflow: 'hidden',
}).theme(
  ({ width, frameWidth, curFrame }: { curFrame: number; frameWidth: number; width: number }) => {
    return {
      width: width === 0 ? 'auto' : width,
      '& > div': {
        opacity: 0,
      },
      [`& > div:nth-child(${curFrame + 1})`]: {
        opacity: 1,
      },
      transform: {
        x: -frameWidth * curFrame,
      },
    }
  },
)
