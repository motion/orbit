import React from 'react'
import { Button, ButtonProps } from './Button'

export function RoundButton(props: ButtonProps) {
  return <Button glint={false} sizeRadius={3} fontWeight={300} display="inline-flex" {...props} />
}
