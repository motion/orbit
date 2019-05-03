import { useTheme } from '@o/gloss'
import React, { useState } from 'react'

import { Card, CardProps } from './Card'
import { FloatingView, FloatingViewProps } from './FloatingView'

type FloatingCardProps = CardProps &
  Pick<
    FloatingViewProps,
    | 'defaultTop'
    | 'defaultLeft'
    | 'disableDrag'
    | 'defaultWidth'
    | 'defaultHeight'
    | 'top'
    | 'left'
    | 'width'
    | 'height'
    | 'usePosition'
  > & {
    visible?: boolean
  }

export function FloatingCard({
  usePosition,
  defaultTop = 0,
  defaultLeft = 0,
  disableDrag,
  defaultWidth,
  defaultHeight,
  top,
  left,
  width,
  height,
  zIndex = 10000000,
  pointerEvents = 'inherit',
  visible,
  ...cardProps
}: FloatingCardProps) {
  const theme = useTheme()
  const [collapsed, setCollapsed] = useState(false)
  const visibilityProps: any = {
    pointerEvents: visible ? pointerEvents : 'none',
    opacity: visible ? 1 : 0,
    transform: {
      y: visible ? 0 : 10,
    },
  }
  return (
    <FloatingView
      disabled={collapsed}
      resizable
      top={top}
      left={left}
      width={width}
      height={collapsed ? 75 : height}
      disableDrag={disableDrag}
      defaultTop={defaultTop}
      defaultLeft={defaultLeft}
      defaultWidth={defaultWidth}
      defaultHeight={defaultHeight}
      zIndex={+zIndex}
      pointerEvents={visibilityProps.pointerEvents}
      usePosition={usePosition}
    >
      <Card
        background={theme.floatingBackground || theme.cardBackground || theme.background}
        elevation={2}
        flex={1}
        margin={5}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        transition="all ease 200ms"
        {...visibilityProps}
        {...cardProps}
      />
    </FloatingView>
  )
}
