import React from 'react'
import { Button, ButtonProps } from './buttons/Button'

export function Badge(props: ButtonProps) {
  return <Button background="red" color="white" circular size={0.8} {...props} />
}
