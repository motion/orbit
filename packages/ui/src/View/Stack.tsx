import { isDefined } from '@o/utils'
import { Base, gloss, validCSSAttr } from 'gloss'
import React, { Suspense } from 'react'

import { Breadcrumbs } from '../Breadcrumbs'
import { CollapsableProps, createCollapsableChildren, splitCollapseProps } from '../Collapsable'
import { Size } from '../Space'
import { createSpacedChildren, SpaceGroupProps } from '../SpaceGroup'
import { isPadded, ScrollableView, wrapWithPaddedView } from './ScrollableView'
import { ScrollableViewProps, ViewProps } from './types'
import { View } from './View'
import { wrappingSpaceTheme } from './wrappingSpaceTheme'

type GroupProps = {
  group?: boolean
  separator?: React.ReactNode
}

export type StackProps = CollapsableProps &
  Omit<ScrollableViewProps, 'direction'> &
  SpaceGroupProps &
  GroupProps & {
    direction?: 'horizontal' | 'vertical'
    suspense?: React.ReactNode | null
  }

export function Stack(colProps: StackProps) {
  const [
    collapseProps,
    {
      space = false,
      spaceAround,
      children,
      beforeSpace,
      afterSpace,
      group,
      separator,
      suspense,
      scrollable,
      direction,
      flexWrap,
      ...props
    },
  ] = splitCollapseProps(colProps)
  let element = children

  // spaceable
  if (space || spaceAround || beforeSpace || afterSpace) {
    element = createSpacedChildren(
      {
        space,
        spaceAround,
        beforeSpace,
        afterSpace,
        children,
      },
      colProps,
    )
  }

  // collapsable
  if (collapseProps) {
    element = createCollapsableChildren({ ...collapseProps, children: element })
  }

  // groupable
  if (group) {
    element = <Breadcrumbs separator={separator}>{element}</Breadcrumbs>
  }

  if (props.flexDirection === undefined) {
    if (direction === 'horizontal') {
      props.flexDirection = 'row'
    }
  }

  // scrollable
  // use even if === false because we may want the scroll context
  if (isDefined(scrollable)) {
    // scrollable wraps in padded already so no need to continue
    return (
      <ScrollableView scrollable={scrollable} parentSpacing={space} {...props}>
        {wrapWithSuspense(element, suspense)}
      </ScrollableView>
    )
  }

  const hasPadding = isPadded(props)

  return (
    // minHeight and padding are handled by paddedView
    <WrappingView {...props} padding={undefined} minHeight={hasPadding ? 'auto' : props.minHeight}>
      {wrapWithWrappingView(wrapWithPaddedView(wrapWithSuspense(element, suspense), props), {
        flexWrap,
        parentSpacing: space,
      })}
    </WrappingView>
  )
}

type WrappedProps = { flexWrap?: ViewProps['flexWrap']; parentSpacing?: Size }

const wrapWithWrappingView = (element: React.ReactNode, props: WrappedProps) => {
  if (props.flexWrap === 'wrap' && props.parentSpacing) {
    return (
      <WrappingView flexWrap={props.flexWrap} isWrapped parentSpacing={props.parentSpacing}>
        {element}
      </WrappingView>
    )
  }
  return element
}

const WrappingView = gloss<WrappedProps, ViewProps>(View, {
  flexDirection: 'inherit',
  maxWidth: '100%',
  alignItems: 'inherit',
  justifyContent: 'inherit',
}).theme(wrappingSpaceTheme)

// for gloss parents
Stack.ignoreAttrs = Base.ignoreAttrs
Stack.acceptsSpacing = true
Stack.defaultProps = {
  'data-is': 'Stack',
}

// static config
Stack.staticStyleConfig = {
  deoptProps: ['animate', 'drag', 'layoutTransition'],
  avoidProps: ['padding', 'minHeight'],
  cssAttributes: {
    ...validCSSAttr,
    // anything we do special with in render(), we ignore for static extraction:
    padding: false,
    minHeight: false,
    // TODO check this works
    direction: {
      name: 'flexDirection',
      value: {
        horizontal: 'row',
        vertical: 'column',
      },
    },
  },
}

function wrapWithSuspense(element: React.ReactNode, suspense: React.ReactNode) {
  return (suspense ? <Suspense fallback={suspense}>{element}</Suspense> : element) as JSX.Element
}
