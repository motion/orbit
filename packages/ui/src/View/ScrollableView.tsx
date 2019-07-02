import { isDefined } from '@o/utils'
import { AnimatedInterpolation, AnimatedValue, withAnimated } from '@react-spring/animated'
import { Col, gloss } from 'gloss'
import React, { forwardRef } from 'react'
import { SpringValue } from 'react-spring'

import { getSpaceSize, Size } from '../Space'
import { Omit } from '../types'
import { usePadding } from './pad'
import { View, ViewProps } from './View'

// dont allow flexFlow so we force props down through flexDirection

export type ScrollableViewProps = Omit<ViewProps, 'flexFlow'> & {
  hideScrollbars?: boolean
  scrollable?: boolean | 'x' | 'y'
  parentSpacing?: Size
  animated?: boolean
  scrollLeft?: SpringValue<number> // TODO | number requires a custom hook
  scrollTop?: SpringValue<number>
}

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
    animated,
    scrollLeft,
    scrollTop,
    ...viewPropsRaw
  } = props
  let content = children
  const hasPadding = isDefined(padding)

  const viewProps = {
    ...viewPropsRaw,
    isWrapped: viewPropsRaw.flexWrap === 'wrap',
    parentSpacing,
  }

  // wrap inner with padding view only if necessary (this is super low level view)
  // this is necessary so CSS scrollable has proper "end margin"
  if (hasPadding) {
    content = <PaddedView padding={padding}>{content}</PaddedView>
  }

  if (!scrollable) {
    const Component = animated ? ScrollableInnerAnimated : ScrollableInner
    const style = animated ? getAnimatedStyleProp(props) : props.style
    return (
      <Component ref={ref} {...viewProps} {...props} style={style}>
        {content}
      </Component>
    )
  }

  const Component = animated ? ScrollableChromeAnimated : ScrollableChrome
  const style = animated ? getAnimatedStyleProp(props) : props.style
  return (
    <Component
      ref={ref}
      scrollable={scrollable}
      scrollTop={scrollTop}
      scrollLeft={scrollLeft}
      {...viewProps}
      {...props}
      className={`ui-scrollable ${hideScrollbars ? 'hide-scrollbars' : ''} ${props.className ||
        ''}`}
      padding={0}
      style={style}
    >
      {content}
    </Component>
  )
})

// find react-spring animated props
export const getAnimatedStyleProp = props => {
  let style = props.style
  for (const key in props) {
    if (key === 'scrollLeft' || key === 'scrollTop') {
      continue
    }
    const val = props[key]
    if (val instanceof AnimatedInterpolation || val instanceof AnimatedValue) {
      style = style || {}
      style[key] = val
    }
  }
  return style
}

// plain padded view
export const PaddedView = gloss<ViewProps>(View, {
  flexDirection: 'inherit',
  flexWrap: 'inherit',
  // dont flex! this ruins the pad and width/height
  // use minHeight/minWidth instead
  // flex: 1,
  alignItems: 'inherit',
  justifyContent: 'inherit',
  overflow: 'inherit',
  // otherwise it "shrinks to fit" vertically and overflow will cut off
  minWidth: '100%',
  minHeight: '100%',
}).theme(usePadding)

// TODO figure this out a bit better and cleanup this code
// i have a feeling ScrollableInner and PaddedView and ScrollableChrome can be simplfiied/unified in some way
const wrappingSpaceTheme = props => {
  if (props.isWrapped) {
    const space = getSpaceSize(props.parentSpacing)
    return {
      marginBottom: -space,
      '& > *': {
        marginBottom: `${space}px !important`,
      },
    }
  }
}

const ScrollableInner = gloss<any & { parentSpacing: Size; isWrapped?: boolean }>(Col, {
  flexDirection: 'inherit',
  flexWrap: 'inherit',
}).theme(wrappingSpaceTheme)

export const ScrollableChrome = gloss<ScrollableViewProps>(ScrollableInner, {
  boxSizing: 'content-box',
  flexDirection: 'inherit',
  flexWrap: 'inherit',
  // width: '100%',
  // height: '100%',
}).theme(({ scrollable }) => ({
  overflow: 'hidden',
  ...(scrollable === 'x' && { overflowX: 'auto', overflowY: 'hidden' }),
  ...(scrollable === 'y' && { overflowY: 'auto', overflowX: 'hidden' }),
  ...(scrollable === true && { overflow: 'auto' }),
}))

const ScrollableInnerAnimated = withAnimated(ScrollableInner)
const ScrollableChromeAnimated = withAnimated(ScrollableChrome)
