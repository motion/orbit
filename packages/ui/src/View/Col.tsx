import { Base } from '@o/gloss'
import React, { forwardRef } from 'react'

import { Breadcrumbs } from '../Breadcrumbs'
import { SpaceGroup, SpaceGroupProps } from '../SpaceGroup'
import { ScrollableView, ScrollableViewProps } from './ScrollableView'

type GroupProps = {
  group?: boolean
  separator?: React.ReactNode
}

export type ColProps = ScrollableViewProps & SpaceGroupProps & GroupProps

export const Col = forwardRef(
  (
    {
      space = false,
      spaceAround,
      children,
      beforeSpace,
      afterSpace,
      group,
      separator,
      ...props
    }: ColProps,
    ref,
  ) => {
    if (!children) {
      return null
    }
    let element = children
    if (space || spaceAround || beforeSpace || afterSpace) {
      element = (
        <SpaceGroup
          spaceAround={spaceAround}
          space={space}
          beforeSpace={beforeSpace}
          afterSpace={afterSpace}
        >
          {element}
        </SpaceGroup>
      )
    }
    if (group) {
      element = <Breadcrumbs separator={separator}>{element}</Breadcrumbs>
    }
    return (
      <ScrollableView ref={ref} flexDirection="column" parentSpacing={space} {...props}>
        {element}
      </ScrollableView>
    )
  },
)

// for gloss parents
// @ts-ignore
Col.ignoreAttrs = Base.ignoreAttrs

// @ts-ignore
Col.acceptsSpacing = true
