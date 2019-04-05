import React from 'react'
import { ScrollableView, ScrollableViewProps } from './ScrollableView'
import { SpaceGroup, SpaceGroupProps } from './SpaceGroup'

export type RowProps = ScrollableViewProps & SpaceGroupProps

export function Row({ space, spaceAround, children, ...props }: RowProps) {
  return (
    <ScrollableView flexDirection="row" {...props}>
      <SpaceGroup spaceAround={spaceAround} space={space}>
        {children}
      </SpaceGroup>
    </ScrollableView>
  )
}
