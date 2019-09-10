import { isDefined } from '@o/utils'
import { Base } from 'gloss'
import React, { isValidElement, Suspense } from 'react'

import { Breadcrumbs } from '../Breadcrumbs'
import { CollapsableProps, createCollapsableChildren, splitCollapseProps } from '../Collapsable'
import { createSpacedChildren, SpaceGroupProps } from '../SpaceGroup'
import { ScrollableView, wrapWithPaddedView } from './ScrollableView'
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
    if (!colProps.children) {
      return null
    }

    // likely not great pattern, was testing spacing elements using descendent selectors
    if ('children' in colProps && Object.keys(colProps).length === 1) {
      return colProps.children as JSX.Element
    }

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
      element = createSpacedChildren({
        space,
        spaceAround,
        beforeSpace,
        afterSpace,
        children,
      })
    }

    // collapsable
    if (collapseProps) {
      element = createCollapsableChildren({ ...collapseProps, children: element })
    }

    // groupable
    if (group) {
      element = <Breadcrumbs separator={separator}>{element}</Breadcrumbs>
    }

    element = suspense ? <Suspense fallback={suspense}>{element}</Suspense> : element

    // scrollable
    // use even if === false because we may want the scroll context
    if (isDefined(scrollable)) {
      // scrollable wraps in padded already so no need to continue
      return (
        <ScrollableView {...defaultProps} scrollable={scrollable} parentSpacing={space} {...props}>
          {element}
        </ScrollableView>
      )
    }

    // padded
    element = wrapWithPaddedView(element, props)
    return (
      <View {...defaultProps} {...props}>
        {element}
      </View>
    )
  }

  // for gloss parents
  BaseView.ignoreAttrs = Base.ignoreAttrs
  BaseView.acceptsSpacing = true

  return BaseView
}
