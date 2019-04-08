import React, { forwardRef } from 'react'
import { SpaceGroup, SpaceGroupProps } from '../SpaceGroup'
import { ScrollableView, ScrollableViewProps } from './ScrollableView'

export type RowProps = ScrollableViewProps & SpaceGroupProps

export const Row = forwardRef(function Row(
  { space, spaceAround, children, ...props }: RowProps,
  ref,
) {
  return (
    <ScrollableView ref={ref} flexDirection="row" {...props}>
      <SpaceGroup spaceAround={spaceAround} space={space}>
        {children}
      </SpaceGroup>
    </ScrollableView>
  )
})
