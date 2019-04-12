import { ButtonProps } from '@o/ui'
import React from 'react'
import { PillButton } from './PillButton'

export function PillButtonDark({ children, ...props }: ButtonProps) {
  return (
    <PillButton background="#111" {...props}>
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
    </PillButton>
  )
}
