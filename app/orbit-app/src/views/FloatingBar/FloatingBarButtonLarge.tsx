import { Button, ButtonProps } from '@mcro/ui'
import * as React from 'react'

export function FloatingBarButtonLarge(props: ButtonProps) {
  return <Button size={1.25} sizeIcon={1.1} circular elevation={1} {...props} />
}
