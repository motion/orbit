import * as React from 'react'
import { Button, ButtonProps } from './Button'

export const BarButtonSmall = React.forwardRef(function FloatingBarButtonSmall(
  props: ButtonProps,
  ref,
) {
  return (
    <Button
      ref={ref}
      borderWidth={0}
      glint={false}
      sizeHeight={0.8}
      sizeIcon={1.5}
      fontWeight={400}
      size={0.95}
      sizeRadius={3}
      opacity={0.8}
      {...props}
    />
  )
})
