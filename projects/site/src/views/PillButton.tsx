import { ButtonProps, SizedSurface } from '@o/ui'
import React from 'react'

export function PillButton({ children, ...props }: ButtonProps) {
  return (
    <SizedSurface
      sizeRadius={100}
      background="linear-gradient(to right, #B65138, #BE0DBE)"
      color={theme => theme.background}
      fontWeight={800}
      fontSize={12}
      letterSpacing={2}
      whiteSpace="pre"
      textTransform="uppercase"
      width="max-content"
      padding={[2, 12]}
      margin={[0, 'auto']}
      {...props}
    >
      {children}
    </SizedSurface>
  )
}
