import { gloss } from '@o/gloss'
import { selectDefined } from '@o/utils'
import React, { forwardRef } from 'react'
import { PaddedView, View, ViewProps } from './View'

export type ScrollableViewProps = ViewProps & {
  hideScrollbars?: boolean
  scrollable?: boolean | 'x' | 'y'
}

export const ScrollableView = forwardRef(function ScrollableView(
  { children, pad, padding, scrollable, ...props }: ScrollableViewProps,
  ref,
) {
  let content = children

  // wrap inner with padding view only if necessary (this is super low level view)
  // this is necessary so CSS scrollable has proper "end margin"
  if (selectDefined(pad, padding, 'NONE') !== 'NONE') {
    content = (
      <PaddedView
        ref={!scrollable ? ref : null}
        pad={pad}
        padding={padding}
        {...!scrollable && props}
      >
        {children}
      </PaddedView>
    )
  }

  if (!scrollable) {
    return (
      <View ref={ref} {...props}>
        {content}
      </View>
    )
  }

  return (
    <ScrollableChrome ref={ref} scrollable={scrollable} {...props}>
      {content}
    </ScrollableChrome>
  )
})

const hideScrollbarsStyle = {
  '&::-webkit-scrollbar': {
    height: 0,
    width: 0,
    background: 'transparent',
  },
}

export const ScrollableChrome = gloss<ScrollableViewProps>(View, {
  boxSizing: 'content-box',
  flexDirection: 'inherit',
  width: '100%',
  height: '100%',
  margin: 1,
}).theme(({ scrollable, hideScrollbars }) => ({
  ...(hideScrollbars && hideScrollbarsStyle),
  overflow: 'hidden',
  ...(scrollable === 'x' && { overflowX: 'auto', overflowY: 'hidden' }),
  ...(scrollable === 'y' && { overflowY: 'auto', overflowX: 'hidden' }),
  ...(scrollable === true && { overflow: 'auto' }),
}))
