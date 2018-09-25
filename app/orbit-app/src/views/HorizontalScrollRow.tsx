import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

export type HorizontalScrollRowProps = {
  height?: number
  verticalPadding?: number
  horizontalPadding?: number
  scrollBarHeight?: number
  children?: React.ReactNode
  forwardRef?: React.RefObject<any>
}

const HorizontalScrollRowFrame = view(UI.View, {
  flex: 1,
  overflow: 'hidden',
})

// for shadows
const extraPad = 20

const Inner = view(UI.View, {
  flexFlow: 'row',
  alignItems: 'center',
  overflow: 'hidden',
  overflowX: 'scroll',
  '&::-webkit-scrollbar': {
    height: 0,
    width: 0,
  },
}).theme(({ height, verticalPadding, scrollBarHeight }) => ({
  height: extraPad * 2 + height + verticalPadding + scrollBarHeight + 3, // 3 ??
  paddingBottom: extraPad + scrollBarHeight + verticalPadding,
  paddingTop: extraPad + verticalPadding + scrollBarHeight,
  paddingLeft: extraPad,
  paddingRight: extraPad,
  marginTop: -(scrollBarHeight / 2 - verticalPadding),
}))

export const HorizontalScrollRow = ({
  height,
  verticalPadding = 0,
  horizontalPadding = 10,
  children,
  scrollBarHeight = 16,
  ...props
}: HorizontalScrollRowProps) => {
  return (
    <HorizontalScrollRowFrame
      height={height + extraPad * 2}
      margin={[-extraPad, -(extraPad - horizontalPadding)]}
    >
      <Inner
        height={height}
        verticalPadding={verticalPadding}
        scrollBarHeight={scrollBarHeight}
        {...props}
      >
        {/* inner div so scrolls to end all the way */}
        <div
          style={{
            flexFlow: 'row',
            paddingTop: verticalPadding,
            paddingBottom: verticalPadding,
          }}
        >
          {children}
        </div>
      </Inner>
    </HorizontalScrollRowFrame>
  )
}
