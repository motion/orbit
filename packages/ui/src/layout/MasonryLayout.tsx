import { SortableContainer } from '@o/react-sortable-hoc'
import AutoResponsive from 'autoresponsive-react'
import React from 'react'
import { useNodeSize } from '../hooks/useNodeSize'
import { View, ViewProps } from '../View/View'
import { useVisiblity } from '../Visibility'

export type MasonryLayoutProps = ViewProps & {
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
    <View ref={size.ref} padded={padded} padding={padding} flex={1}>
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
    </View>
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
