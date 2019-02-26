import * as React from 'react'
import { Button, ButtonProps } from './Button'

export const BarButtonSmall = React.forwardRef(function FloatingBarButtonSmall(
  props: ButtonProps,
  ref,
) {
  return (
    <Button
      ref={ref}
      glint={false}
      borderWidth={0}
      sizeHeight={0.85}
      sizeIcon={1.5}
      fontWeight={400}
      size={0.95}
      sizeRadius={3}
      opacity={0.8}
      {...props}
    />
  )
})
