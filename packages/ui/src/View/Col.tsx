import { isDefined } from '@o/utils'
import { Base } from 'gloss'
import React, { isValidElement, Suspense } from 'react'

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

export type ColProps = CollapsableProps &
  ScrollableViewProps &
  SpaceGroupProps &
  GroupProps & {
    suspense?: React.ReactNode | null
  }

export const Col = createBaseView({ flexDirection: 'column', 'data-is': 'Col' })

export function createBaseView(defaultProps: any): (props: ColProps) => JSX.Element {
  function BaseView(colProps: ColProps) {
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

    // scrollable
    // use even if === false because we may want the scroll context
    if (isDefined(scrollable)) {
      // scrollable wraps in padded already so no need to continue
      return (
        <ScrollableView {...defaultProps} scrollable={scrollable} parentSpacing={space} {...props}>
          {wrapWithSuspense(element, suspense)}
        </ScrollableView>
      )
    }

    const hasPadding = isPadded(props)

    return (
      // minHeight and padding are handled by paddedView
      <View
        {...defaultProps}
        {...props}
        padding="disable-padding"
        minHeight={hasPadding ? 'auto' : props.minHeight}
      >
        {wrapWithPaddedView(wrapWithSuspense(element, suspense), props)}
      </View>
    )
  }

  // for gloss parents
  BaseView.ignoreAttrs = Base.ignoreAttrs
  BaseView.acceptsSpacing = true

  return BaseView
}

function wrapWithSuspense(element: React.ReactNode, suspense: React.ReactNode) {
  return (suspense ? <Suspense fallback={suspense}>{element}</Suspense> : element) as JSX.Element
}
