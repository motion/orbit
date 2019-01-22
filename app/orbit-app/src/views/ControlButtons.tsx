import { Button, ButtonProps } from '@mcro/ui'
import * as React from 'react'

export function ControlButton(props: ButtonProps) {
  return (
    <Button
      borderWidth={0}
      sizeHeight={0.8}
      sizeIcon={1.45}
      fontWeight={500}
      size={0.95}
      sizeRadius={3}
      opacity={0.8}
      {...props}
    />
  )
}
