import React from 'react'

import { Button, ButtonProps } from './buttons/Button'
import { getSize } from './Sizes'
import { Sizes } from './Space'

export type BadgeProps = Omit<ButtonProps, 'children'> & {
  children: any
  size?: Sizes
}

export function Badge({ children, size, ...props }: BadgeProps) {
  const bSize = getSize(size)
  return (
    <Button
      tagName="div"
      fontWeight={600}
      background="red"
      color="white"
      circular
      size={0.5 * bSize}
      sizeFont={1 * bSize}
      borderWidth={0}
      glint={false}
      glintBottom={false}
      {...props}
    >
      {typeof children === 'number' && children > 99 ? 99 : children}
    </Button>
  )
}
