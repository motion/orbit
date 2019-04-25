import { Base } from '@o/gloss'
import React, { forwardRef } from 'react'

import { Breadcrumbs } from '../Breadcrumbs'
import { CollapsableProps, createCollapsableChildren, splitCollapseProps } from '../Collapsable'
import { createSpacedChildren, SpaceGroupProps } from '../SpaceGroup'
import { ScrollableView, ScrollableViewProps } from './ScrollableView'

type GroupProps = {
  group?: boolean
  separator?: React.ReactNode
}

export type ColProps = CollapsableProps & ScrollableViewProps & SpaceGroupProps & GroupProps

export const Col = forwardRef((colProps: ColProps, ref) => {
  if (!colProps.children) {
    return null
  }
  const [
    collapseProps,
    { space = false, spaceAround, children, beforeSpace, afterSpace, group, separator, ...props },
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
    <ScrollableView ref={ref} flexDirection="column" parentSpacing={space} {...props}>
      {element}
    </ScrollableView>
  )
})

// for gloss parents
// @ts-ignore
Col.ignoreAttrs = Base.ignoreAttrs

// @ts-ignore
Col.acceptsSpacing = true
