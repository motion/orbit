import React from 'react'
import { Button, ButtonProps } from './buttons/Button'
import { Omit } from './types'

export type BadgeProps = Omit<ButtonProps, 'children'> & {
  children: any
}

export function Badge({ children, ...props }: BadgeProps) {
  return (
    <Button
      fontWeight={600}
      background="red"
      color="white"
      circular
      size={0.7}
      sizeFont={1.2}
      elementProps={{
        transform: {
          y: -0.5,
        },
      }}
      {...props}
    >
      {typeof children === 'number' && children > 99 ? 99 : children}
    </Button>
  )
}
