import { Button, ButtonProps } from '@o/ui'
import React from 'react'

export const Key = (props: ButtonProps) => {
  return (
    <Button
      size="xs"
      glint={false}
      fontWeight={600}
      background={theme => theme.background}
      hoverStyle={false}
      activeStyle={false}
      {...props}
    />
  )
}
