import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

const HorizontalScrollRowFrame = view(UI.View, {
  maxWidth: '100%',
  overflow: 'hidden',
})

const Inner = view(UI.View, {
  flexFlow: 'row',
  alignItems: 'center',
  overflow: 'hidden',
  overflowX: 'scroll',
  '&::-webkit-scrollbar': {
    height: 0,
    width: 0,
  },
})

Inner.theme = ({ height, verticalPadding, scrollBarHeight }) => ({
  height: height + verticalPadding + scrollBarHeight + 3, // 3 ??
  paddingBottom: scrollBarHeight + verticalPadding,
  paddingTop: verticalPadding + scrollBarHeight,
  marginTop: -(scrollBarHeight / 2 - verticalPadding),
})

export const HorizontalScrollRow = ({
  height,
  verticalPadding = 0,
  children,
  scrollBarHeight = 16,
  ...props
}) => {
  return (
    <HorizontalScrollRowFrame height={height}>
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
