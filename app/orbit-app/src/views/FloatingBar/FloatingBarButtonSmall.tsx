import { Button, ButtonProps } from '@mcro/ui'
import * as React from 'react'

export function FloatingBarButtonSmall(props: ButtonProps) {
  return (
    <Button
      glint={false}
      borderWidth={0}
      sizeHeight={0.75}
      sizeIcon={1.45}
      fontWeight={500}
      size={0.95}
      sizeRadius={3}
      opacity={0.8}
      {...props}
    />
  )
}
