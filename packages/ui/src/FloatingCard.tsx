import React from 'react'
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
  >

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
  ...cardProps
}: FloatingCardProps) {
  return (
    <FloatingView
      resizable
      top={top}
      left={left}
      width={width}
      height={height}
      disableDrag={disableDrag}
      defaultTop={defaultTop}
      defaultLeft={defaultLeft}
      defaultWidth={defaultWidth}
      defaultHeight={defaultHeight}
    >
      <Card elevation={2} flex={1} margin={5} {...cardProps} />
    </FloatingView>
  )
}
