import { gloss } from '@o/gloss'
import React from 'react'
import { View, ViewProps } from './View'

export type ScrollableViewProps = ViewProps & {
  hideScrollbars?: boolean
  scrollable?: boolean | 'x' | 'y'
}

export function ScrollableView({
  children,
  pad,
  padding,
  scrollable,
  ...props
}: ScrollableViewProps) {
  const contents = (
    <View pad={pad} padding={padding}>
      {children}
    </View>
  )

  if (!scrollable) {
    return contents
  }

  return (
    <ScrollableChrome scrollable={scrollable} {...props}>
      {contents}
    </ScrollableChrome>
  )
}

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
  ...(scrollable === 'x' && { overflowX: 'auto', overflowY: 'hidden' }),
  ...(scrollable === 'y' && { overflowX: 'auto', overflowY: 'hidden' }),
  ...(scrollable === true && { overflow: 'auto' }),
}))
