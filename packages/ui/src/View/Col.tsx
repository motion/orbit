import React from 'react'
import { ScrollableView, ScrollableViewProps } from './ScrollableView'
import { SpaceGroup, SpaceGroupProps } from './SpaceGroup'

export type ColProps = ScrollableViewProps & SpaceGroupProps

export function Col({ space, spaceAround, children, ...props }: ColProps) {
  return (
    <ScrollableView flexDirection="column" {...props}>
      <SpaceGroup spaceAround={spaceAround} space={space}>
        {children}
      </SpaceGroup>
    </ScrollableView>
  )
}
