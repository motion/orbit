import { Base } from '@o/gloss'
import React, { forwardRef } from 'react'
import { SpaceGroup, SpaceGroupProps } from '../SpaceGroup'
import { ScrollableView, ScrollableViewProps } from './ScrollableView'

export type RowProps = ScrollableViewProps & SpaceGroupProps

export const Row = forwardRef(function Row(
  { space = false, spaceAround, children, beforeSpace, afterSpace, ...props }: RowProps,
  ref,
) {
  return (
    <ScrollableView ref={ref} flexDirection="row" {...props}>
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
Row.ignoreAttrs = Base.ignoreAttrs
