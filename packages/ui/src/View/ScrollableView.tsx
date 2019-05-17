import { isDefined } from '@o/utils'
import { Col, gloss } from 'gloss'
import React, { forwardRef } from 'react'

import { getSpaceSize, Sizes } from '../Space'
import { Omit } from '../types'
import { getPadding } from './pad'
import { PaddedView } from './PaddedView'
import { ViewProps } from './View'

// dont allow flexFlow so we force props down through flexDirection

export type ScrollableViewProps = Omit<ViewProps, 'flexFlow'> & {
  hideScrollbars?: boolean
  scrollable?: boolean | 'x' | 'y'
  parentSpacing?: Sizes
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

  const { children, pad, padding, scrollable, parentSpacing, ...viewPropsRaw } = props
  let content = children
  const controlPad = typeof pad !== 'undefined'

  const viewProps = {
    ...viewPropsRaw,
    isWrapped: viewPropsRaw.flexWrap === 'wrap',
    parentSpacing,
    ...(!controlPad && {
      padding,
    }),
  }

  if (!scrollable) {
    return (
      <ScrollableInner ref={ref} {...viewProps} {...props}>
        {content}
      </ScrollableInner>
    )
  }

  // wrap inner with padding view only if necessary (this is super low level view)
  // this is necessary so CSS scrollable has proper "end margin"
  const innerPad = getPadding(props)
  const hasInnerPad = !!(innerPad && innerPad.padding)

  if (hasInnerPad) {
    content = (
      <PaddedView ref={!scrollable ? ref : null} {...!scrollable && viewPropsRaw} {...innerPad}>
        {content}
      </PaddedView>
    )
  }

  return (
    <ScrollableChrome
      className="ui-scrollable"
      ref={ref}
      scrollable={scrollable}
      {...viewProps}
      {...props}
      padding={0}
    >
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

const ScrollableInner = gloss<any & { parentSpacing: any; isWrapped?: boolean }>(Col, {
  flexDirection: 'inherit',
  flexWrap: 'inherit',
}).theme(props => {
  if (props.isWrapped) {
    const space = getSpaceSize(props.parentSpacing)
    return {
      marginBottom: -space,
      '& > *': {
        marginBottom: `${space}px !important`,
      },
    }
  }
})

export const ScrollableChrome = gloss<ScrollableViewProps>(ScrollableInner, {
  boxSizing: 'content-box',
  flexDirection: 'inherit',
  flexWrap: 'inherit',
  width: '100%',
  height: '100%',
}).theme(({ scrollable, hideScrollbars }) => ({
  ...(hideScrollbars && hideScrollbarsStyle),
  overflow: 'hidden',
  ...(scrollable === 'x' && { overflowX: 'auto', overflowY: 'hidden' }),
  ...(scrollable === 'y' && { overflowY: 'auto', overflowX: 'hidden' }),
  ...(scrollable === true && { overflow: 'auto' }),
}))
