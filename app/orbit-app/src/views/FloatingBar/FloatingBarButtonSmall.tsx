import { Button, ButtonProps } from '@mcro/ui'
import * as React from 'react'

export function FloatingBarButtonSmall(props: ButtonProps) {
  return (
    <Button
      glint={false}
      borderWidth={0}
      sizeHeight={0.8}
      sizeIcon={1.5}
      fontWeight={400}
      size={0.95}
      sizeRadius={3}
      opacity={0.8}
      {...props}
    />
  )
}
