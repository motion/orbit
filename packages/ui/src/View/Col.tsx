import React, { forwardRef } from 'react'
import { SpaceGroup, SpaceGroupProps } from '../SpaceGroup'
import { ScrollableView, ScrollableViewProps } from './ScrollableView'

export type ColProps = ScrollableViewProps & SpaceGroupProps

export const Col = forwardRef(function Col(
  { space, spaceAround, children, ...props }: ColProps,
  ref,
) {
  return (
    <ScrollableView ref={ref} flexDirection="column" {...props}>
      <SpaceGroup spaceAround={spaceAround} space={space}>
        {children}
      </SpaceGroup>
    </ScrollableView>
  )
})
