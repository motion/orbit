import React, { forwardRef } from 'react'
import { Button, ButtonProps } from './Button'

export const BarButtonSmall = forwardRef(function BarButtonSmall(props: ButtonProps, ref) {
  return (
    <Button
      ref={ref}
      borderWidth={0}
      glint={false}
      sizeHeight={0.8}
      sizeIcon={1.5}
      fontWeight={400}
      size={0.95}
      sizePadding={1.4}
      sizeRadius={3}
      {...props}
    />
  )
})
