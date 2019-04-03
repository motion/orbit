import React from 'react'
import { Button, ButtonProps } from './buttons/Button'
import { Omit } from './types'

export type BadgeProps = Omit<ButtonProps, 'children'> & {
  children: any
}

export function Badge({ children, ...props }: BadgeProps) {
  return (
    <Button fontWeight={600} background="red" color="white" circular size={0.8} {...props}>
      {typeof children === 'number' && children > 99 ? 99 : children}
    </Button>
  )
}
