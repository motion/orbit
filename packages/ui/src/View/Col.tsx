import { Base } from '@o/gloss'
import React, { forwardRef } from 'react'
import { SpaceGroup, SpaceGroupProps } from '../SpaceGroup'
import { ScrollableView, ScrollableViewProps } from './ScrollableView'

export type ColProps = ScrollableViewProps & SpaceGroupProps

export const Col = forwardRef(function Col(
  { space = false, spaceAround, children, beforeSpace, afterSpace, ...props }: ColProps,
  ref,
) {
  return (
    <ScrollableView ref={ref} flexDirection="column" {...props}>
      <SpaceGroup
        spaceAround={spaceAround}
        space={space}
        beforeSpace={beforeSpace}
        afterSpace={afterSpace}
      >
        {children}
      </SpaceGroup>
    </ScrollableView>
  )
})

// for gloss parents
// @ts-ignore
Col.ignoreAttrs = Base.ignoreAttrs
