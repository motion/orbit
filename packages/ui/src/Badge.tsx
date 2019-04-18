import React from 'react'
import { Button, ButtonProps } from './buttons/Button'
import { getSize } from './Sizes'
import { Sizes } from './Space'
import { Omit } from './types'

export type BadgeProps = Omit<ButtonProps, 'children'> & {
  children: any
  size?: Sizes
}

export function Badge({ children, size, ...props }: BadgeProps) {
  const bSize = getSize(size)
  return (
    <Button
      fontWeight={600}
      background="red"
      color="white"
      circular
      size={0.65 * bSize}
      sizeFont={1 * bSize}
      {...props}
    >
      {typeof children === 'number' && children > 99 ? 99 : children}
    </Button>
  )
}
