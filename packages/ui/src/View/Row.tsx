import React from 'react'
import { ScrollableView, ScrollableViewProps } from './ScrollableView'
import { SpaceGroup, SpaceGroupProps } from './SpaceGroup'

export type RowProps = ScrollableViewProps & SpaceGroupProps

export function Row({ spacing, spaceAround, children, ...props }: RowProps) {
  return (
    <ScrollableView flexDirection="row" {...props}>
      <SpaceGroup spaceAround={spaceAround} spacing={spacing}>
        {children}
      </SpaceGroup>
    </ScrollableView>
  )
}
