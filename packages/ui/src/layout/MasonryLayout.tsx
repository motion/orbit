import { SortableContainer } from '@o/react-sortable-hoc'
import AutoResponsive from 'autoresponsive-react'
import React from 'react'
import { useNodeSize } from '../hooks/useNodeSize'
import { Padded, PaddedProps } from '../Padded'
import { useVisiblity } from '../Visibility'

export type MasonryLayoutProps = PaddedProps & {
  children?: React.ReactNode
}

export function MasonryLayout({ children, padded, padding, ...props }: MasonryLayoutProps) {
  const visible = useVisiblity()
  const size = useNodeSize({
    throttle: 500,
    ignoreFirst: true,
    disable: !visible,
  })
  return (
    <Padded ref={size.ref} padded={padded} padding={padding} flex={1}>
      <SortableResponsive
        sortable
        transitionDuration={0.5}
        itemMargin={10}
        gridWidth={20}
        containerWidth={size.width}
        {...props}
      >
        {children}
      </SortableResponsive>
    </Padded>
  )
}

const SortableResponsive = SortableContainer(AutoResponsive) as any

export type GridLayoutItemProps = {
  width: number
  height: number
  children: React.ReactNode
}

MasonryLayout.Item = function({ width, height, children }: GridLayoutItemProps) {
  return <div style={{ width, height }}>{children}</div>
}
