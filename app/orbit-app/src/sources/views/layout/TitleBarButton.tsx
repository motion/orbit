import { Button, ButtonProps } from '@mcro/ui'
import * as React from 'react'

export function TitleBarButton(props: ButtonProps) {
  return (
    <Button size={0.9} sizeRadius={1} sizeFont={1.1} sizePadding={0.95} iconSize={11} {...props} />
  )
}
