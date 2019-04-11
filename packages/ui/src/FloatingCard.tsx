import { useTheme } from '@o/gloss'
import React, { useState } from 'react'
import { Card, CardProps } from './Card'
import { FloatingView, FloatingViewProps } from './FloatingView'
import { Visibility } from './Visibility'

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
  > & {
    visible?: boolean
  }

export function FloatingCard({
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
  pointerEvents,
  visible,
  ...cardProps
}: FloatingCardProps) {
  const theme = useTheme()
  const [collapsed, setCollapsed] = useState(false)
  const isInvisible =
    visible === false ||
    cardProps.opacity === 0 ||
    cardProps.visibility === 'hidden' ||
    cardProps.display === 'none'
  return (
    <Visibility visible={!isInvisible}>
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
        pointerEvents={pointerEvents}
      >
        <Card
          background={theme.floatingBackground || theme.cardBackground || theme.background}
          elevation={2}
          flex={1}
          margin={5}
          collapsed={collapsed}
          onCollapse={setCollapsed}
          // visibility props
          {...{
            pointerEvents: visible ? 'auto' : 'none',
            opacity: visible ? 1 : 0,
            transform: {
              y: visible ? 0 : 10,
            },
          }}
          {...cardProps}
        />
      </FloatingView>
    </Visibility>
  )
}
