import React, { forwardRef } from 'react'
import { SpaceGroup, SpaceGroupProps } from '../SpaceGroup'
import { ScrollableView, ScrollableViewProps } from './ScrollableView'

export type RowProps = ScrollableViewProps & SpaceGroupProps

export const Row = forwardRef(function Row(
  { space = false, spaceAround, separator, children, ...props }: RowProps,
  ref,
) {
  return (
    <ScrollableView ref={ref} flexDirection="row" {...props}>
      <SpaceGroup spaceAround={spaceAround} space={space} separator={separator}>
        {children}
      </SpaceGroup>
    </ScrollableView>
  )
})
