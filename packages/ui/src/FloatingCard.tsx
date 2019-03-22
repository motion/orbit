import React from 'react'
import { Card, CardProps } from './Card'
import { FloatingView, FloatingViewProps } from './FloatingView'

type FloatingCardProps = CardProps &
  Pick<
    FloatingViewProps,
    'defaultTop' | 'defaultLeft' | 'disableDrag' | 'defaultWidth' | 'defaultHeight'
  >

export function FloatingCard({
  defaultTop = 0,
  defaultLeft = 0,
  disableDrag,
  defaultWidth,
  defaultHeight,
  ...cardProps
}: FloatingCardProps) {
  return (
    <FloatingView
      resizable
      disableDrag={disableDrag}
      defaultTop={defaultTop}
      defaultLeft={defaultLeft}
      defaultWidth={defaultWidth}
      defaultHeight={defaultHeight}
    >
      <Card elevation={2} flex={1} {...cardProps}>
        lorem
      </Card>
    </FloatingView>
  )
}
