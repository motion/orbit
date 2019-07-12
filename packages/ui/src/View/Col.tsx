import { Base } from 'gloss'
import React, { forwardRef, Suspense } from 'react'

import { Breadcrumbs } from '../Breadcrumbs'
import { CollapsableProps, createCollapsableChildren, splitCollapseProps } from '../Collapsable'
import { createSpacedChildren, SpaceGroupProps } from '../SpaceGroup'
import { ScrollableView, ScrollableViewProps } from './ScrollableView'

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

export function createBaseView(defaultProps: any) {
  const View = forwardRef((colProps: ColProps, ref) => {
    if (!colProps.children) {
      return null
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

    // scrollable
    return (
      <ScrollableView ref={ref} {...defaultProps} parentSpacing={space} {...props}>
        {suspense ? <Suspense fallback={suspense}>{element}</Suspense> : element}
      </ScrollableView>
    )
  })

  // for gloss parents
  // @ts-ignore
  View.ignoreAttrs = Base.ignoreAttrs

  // @ts-ignore
  View.acceptsSpacing = true

  return View
}
