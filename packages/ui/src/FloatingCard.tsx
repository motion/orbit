import { useTheme } from 'gloss'
import React, { useState } from 'react'

import { Card, CardProps } from './Card'
import { FloatingView, FloatingViewProps } from './FloatingView'
import { useVisibility } from './Visibility'

type FloatingCardProps = Omit<CardProps, 'maxHeight' | 'maxWidth'> &
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
    | 'attach'
    | 'edgePadding'
    | 'maxHeight'
    | 'maxWidth'
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
  pointerEvents = 'auto',
  visible,
  attach,
  edgePadding,
  elevation = 2,
  maxHeight,
  maxWidth,
  ...cardProps
}: FloatingCardProps) {
  const isVisible = useVisibility()
  const theme = useTheme()
  const [collapsed, setCollapsed] = useState(false)
  const visibilityProps: any = {
    pointerEvents: isVisible && visible ? pointerEvents : 'none',
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
      attach={attach}
      edgePadding={edgePadding}
      maxHeight={maxHeight}
      maxWidth={maxWidth}
    >
      <Card
        background={theme.floatingBackground || theme.cardBackground || theme.background}
        elevation={elevation}
        flex={1}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        transition="all ease 200ms"
        {...visibilityProps}
        {...cardProps}
      />
    </FloatingView>
  )
}
