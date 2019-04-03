import { View } from '@o/gloss'
import AutoResponsive from 'autoresponsive-react'
import React from 'react'
import { useNodeSize } from '../hooks/useNodeSize'

export type GridLayoutProps = {
  children?: React.ReactNode
}

export function GridLayout({ children, ...props }: GridLayoutProps) {
  const size = useNodeSize({
    throttle: 500,
    ignoreFirst: true,
  })
  return (
    <View ref={size.ref} flex={1}>
      <AutoResponsive
        transitionDuration=".5"
        itemMargin={10}
        gridWidth={100}
        containerWidth={size.width}
        {...props}
      >
        {children}
      </AutoResponsive>
    </View>
  )
}

export type GridLayoutItemProps = {
  width: number
  height: number
  children: React.ReactNode
}

GridLayout.Item = function({ width, height, children }: GridLayoutItemProps) {
  return <div style={{ width, height }}>{children}</div>
}
