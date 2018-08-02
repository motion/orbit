import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

const CarouselWithoutScrollbarFrame = view(UI.View, {
  maxWidth: '100%',
  overflow: 'hidden',
})

const CarouselInner = view({
  flexFlow: 'row',
  alignItems: 'center',
  overflow: 'hidden',
  overflowX: 'auto',
})

CarouselInner.theme = ({ height, padding, scrollBarHeight }) => ({
  height: height + padding + scrollBarHeight + 3, // 3 ??
  paddingBottom: scrollBarHeight + padding,
  marginBottom: -(scrollBarHeight + padding),
})

export const CarouselWithoutScrollbar = ({
  height,
  padding = 0,
  children,
  scrollBarHeight = 16,
  ...props
}) => {
  return (
    <CarouselWithoutScrollbarFrame height={height}>
      <CarouselInner
        height={height}
        padding={padding}
        scrollBarHeight={scrollBarHeight}
        {...props}
      >
        {/* inner div so scrolls to end all the way */}
        <div style={{ flexFlow: 'row', padding }}>{children}</div>
      </CarouselInner>
    </CarouselWithoutScrollbarFrame>
  )
}
