import { isDefined } from '@o/utils'
import { AnimatedInterpolation, AnimatedValue, withAnimated } from '@react-spring/animated'
import { Base, Col, gloss } from 'gloss'
import React, { forwardRef } from 'react'
import { SpringValue } from 'react-spring'

import { getSpaceSize, Size } from '../Space'
import { usePadding } from './pad'
import { ViewProps } from './View'

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

  // we may want to memo this, need to test if add/remove padding will cause remounts
  let content = children
  const hasPadding = isDefined(padding)

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
      >
        {content}
      </PaddedView>
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

/**
 * This can only be used on the innermost element to space its children, css-specific
 */
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

export const PaddedView = gloss<
  ViewProps & Pick<ScrollableViewProps, 'scrollable' | 'parentSpacing'> & { isWrapped?: boolean }
>(Base, {
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
}).theme(
  props => ({
    ...(!props.scrollable && { maxWidth: '100%' }),
    ...(props.scrollable === 'x' && { maxHeight: '100%' }),
    ...(props.scrollable === 'y' && { maxWidth: '100%' }),
  }),
  usePadding,
  wrappingSpaceTheme,
)

export const ScrollableChrome = gloss<ScrollableViewProps>(Col, {
  boxSizing: 'content-box',
  flexDirection: 'inherit',
  flexWrap: 'inherit',
  // width: '100%',
  // height: '100%',
}).theme(props => ({
  ...(props.scrollable === 'x' && { overflowX: 'auto', overflowY: 'hidden' }),
  ...(props.scrollable === 'y' && { overflowY: 'auto', overflowX: 'hidden' }),
  ...(props.scrollable === true && { overflow: 'auto' }),
  ...(!props.scrollable && wrappingSpaceTheme(props)),
}))

const ScrollableChromeAnimated = withAnimated(ScrollableChrome)
