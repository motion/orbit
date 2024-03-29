import { gloss } from 'gloss'
import React, { useRef } from 'react'

import { composeRefs } from '../helpers/composeRefs'
import { PaddedView } from './PaddedView'
import { ScrollableIntersection, ScrollableParentContext } from './ScrollableParentStore'
import { ScrollableViewProps } from './types'
import { View } from './View'
import { wrappingSpaceTheme } from './wrappingSpaceTheme'

// dont allow flexDirection so we force props down through flexDirection

export function ScrollableView(props: ScrollableViewProps) {
  const ref = useRef(null)
  const scrollableParent = ScrollableParentContext.useCreateStore({ ref })
  const { children, scrollable, parentSpacing, hideScrollbars, minHeight, ...rest } = props

  // ignore minHeight, use in paddedview
  minHeight

  // add padding inside scrollable so we get proper padding after end elements
  const content = wrapWithPaddedView(children, props)
  const hasPadding = isPadded(props)

  return (
    <ScrollableParentContext.ProvideStore value={scrollableParent}>
      {scrollable && scrollableParent.shouldScrollIntersect && (
        <ScrollableIntersection
          direction={scrollable === true ? 'y' : scrollable}
          scrollableParent={scrollableParent}
        />
      )}
      <ScrollableChrome
        scrollable={scrollable}
        parentSpacing={parentSpacing}
        {...rest}
        nodeRef={composeRefs(props.nodeRef, ref)}
        className={`${hideScrollbars ? 'hide-scrollbars' : ''} ${props.className || ''}`}
        padding={undefined}
        minHeight={hasPadding ? 'auto' : props.minHeight}
      >
        {content}
      </ScrollableChrome>
    </ScrollableParentContext.ProvideStore>
  )
}

export const ScrollableChrome = gloss<ScrollableViewProps>(View, {
  boxSizing: 'content-box',
  flexDirection: 'inherit',
  flexWrap: 'inherit',
}).theme(props => ({
  ...(props.scrollable === 'x' && { overflowX: 'auto', overflowY: 'hidden' }),
  ...(props.scrollable === 'y' && { overflowY: 'auto', overflowX: 'hidden' }),
  ...(props.scrollable === true && { overflow: 'auto' }),
  ...(!props.scrollable && wrappingSpaceTheme(props)),
}))

export const isPadded = (props: ScrollableViewProps) =>
  Array.isArray(props.padding) ? props.padding.some(x => !!x) : !!props.padding

export function wrapWithPaddedView(
  element: React.ReactNode,
  props: ScrollableViewProps,
): JSX.Element {
  // wrap inner with padding view only if necessary (this is a low level view)
  // this is necessary so CSS scrollable has proper "end margin"
  if (isPadded(props)) {
    const isWrapped = props.flexWrap === 'wrap'
    element = (
      <PaddedView
        {...props}
        flex={undefined}
        className={undefined}
        style={undefined}
        isWrapped={isWrapped}
        parentSpacing={props.parentSpacing}
      >
        {element}
      </PaddedView>
    )
  }
  return element as JSX.Element
}
