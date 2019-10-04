import { ButtonProps, Surface } from '@o/ui'
import React from 'react'

import { fontProps } from '../constants'

export function PillButton({ children, ...props }: ButtonProps) {
  return (
    <Surface
      sizeRadius={100}
      background="linear-gradient(to right, #B65138, #BE0DBE)"
      color={theme => theme.background}
      {...fontProps.TitleFont}
      fontWeight={600}
      fontSize={12}
      lineHeight={20}
      letterSpacing={3}
      whiteSpace="pre"
      textTransform="uppercase"
      userSelect="none"
      width="max-content"
      padding={[2, 12]}
      margin={[0, 'auto']}
      {...props}
    >
      {children}
    </Surface>
  )
}
