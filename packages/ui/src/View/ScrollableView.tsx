import { isDefined } from '@o/utils'
import { gloss } from 'gloss'
import React, { forwardRef } from 'react'

import { PaddedView } from './PaddedView'
import { ScrollableViewProps } from './types'
import { View } from './View'
import { wrappingSpaceTheme } from './wrappingSpaceTheme'

// dont allow flexFlow so we force props down through flexDirection

const isOnlyChildrenDefined = props => {
  for (const key in props) {
    if (isDefined(props[key]) && key !== 'children') {
      return false
    }
  }
  return true
}

export const ScrollableView = forwardRef(function ScrollableView(props: ScrollableViewProps, ref) {
  // likely not great pattern, was testing spacing elements using descendent selectors
  if (isOnlyChildrenDefined(props)) {
    return <>{props.children}</>
  }

  const {
    children,
    padding,
    scrollable,
    parentSpacing,
    hideScrollbars,
    scrollLeft,
    scrollTop,
    ...viewPropsRaw
  } = props

  // we may want to memo this, need to test if add/remove padding will cause remounts
  let content = children
  const hasPadding = Array.isArray(padding) ? padding.some(Boolean) : !!padding

  const isWrapped = viewPropsRaw.flexWrap === 'wrap'
  const viewProps = {
    ...viewPropsRaw,
    isWrapped,
    parentSpacing,
  }

  // wrap inner with padding view only if necessary (this is super low level view)
  // this is necessary so CSS scrollable has proper "end margin"
  if (hasPadding) {
    content = (
      <PaddedView
        scrollable={scrollable}
        parentSpacing={parentSpacing}
        isWrapped={isWrapped}
        padding={padding}
        flex={props.flex}
      >
        {content}
      </PaddedView>
    )
  }

  return (
    <ScrollableChrome
      ref={ref}
      scrollable={scrollable}
      scrollTop={scrollTop}
      scrollLeft={scrollLeft}
      {...viewProps}
      {...props}
      className={`${hideScrollbars ? 'hide-scrollbars' : ''} ${props.className || ''}`}
      padding={0}
    >
      {content}
    </ScrollableChrome>
  )
})

const ScrollableChrome = gloss<ScrollableViewProps>(View, {
  boxSizing: 'content-box',
  flexDirection: 'inherit',
  flexWrap: 'inherit',
}).theme(props => ({
  ...(props.scrollable === 'x' && { overflowX: 'auto', overflowY: 'hidden' }),
  ...(props.scrollable === 'y' && { overflowY: 'auto', overflowX: 'hidden' }),
  ...(props.scrollable === true && { overflow: 'auto' }),
  ...(!props.scrollable && wrappingSpaceTheme(props)),
}))
