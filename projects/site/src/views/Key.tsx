import { Button, ButtonProps, useTheme } from '@o/ui'
import React from 'react'

export const Key = (props: ButtonProps) => {
  const theme = useTheme()
  return (
    <Button
      display="inline"
      size="xs"
      glint={false}
      fontWeight={600}
      background={theme.background}
      hoverStyle={false}
      activeStyle={false}
      {...props}
    />
  )
}
