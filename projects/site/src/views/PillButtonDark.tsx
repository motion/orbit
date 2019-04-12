import { ButtonProps, SizedSurface } from '@o/ui'
import React from 'react'

export function PillButtonDark({ children, ...props }: ButtonProps) {
  return (
    <SizedSurface
      sizeRadius={100}
      background="#111"
      fontWeight={800}
      letterSpacing={2}
      textTransform="uppercase"
      width="min-content"
      padding={[3, 12]}
      margin={[0, 'auto']}
      {...props}
    >
      <span
        className="clip-text"
        style={{
          background: 'linear-gradient(to left, #B74E42, #BE0FAD)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {children}
      </span>
    </SizedSurface>
  )
}
