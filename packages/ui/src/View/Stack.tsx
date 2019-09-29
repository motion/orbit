import { isDefined } from '@o/utils'
import { Base, validCSSAttr } from 'gloss'
import React, { Suspense } from 'react'

import { Breadcrumbs } from '../Breadcrumbs'
import { CollapsableProps, createCollapsableChildren, splitCollapseProps } from '../Collapsable'
import { createSpacedChildren, SpaceGroupProps } from '../SpaceGroup'
import { isPadded, ScrollableView, wrapWithPaddedView } from './ScrollableView'
import { ScrollableViewProps } from './types'
import { View } from './View'

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

export const Stack = createStackView({ 'data-is': 'Stack' })

export function createStackView(defaultProps: any): (props: StackProps) => JSX.Element {
  function BaseView(colProps: StackProps) {
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
      <View {...props} padding={false} minHeight={hasPadding ? 'auto' : props.minHeight}>
        {wrapWithPaddedView(wrapWithSuspense(element, suspense), props)}
      </View>
    )
  }

  // for gloss parents
  BaseView.ignoreAttrs = Base.ignoreAttrs
  BaseView.acceptsSpacing = true
  BaseView.defaultProps = defaultProps

  // static config
  BaseView.staticStyleConfig = {
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

  return BaseView
}

function wrapWithSuspense(element: React.ReactNode, suspense: React.ReactNode) {
  return (suspense ? <Suspense fallback={suspense}>{element}</Suspense> : element) as JSX.Element
}
