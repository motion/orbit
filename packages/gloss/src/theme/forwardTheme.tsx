import { ThemeObject } from '@o/css'
import React from 'react'
import { Theme } from './Theme'

export function forwardTheme({ children, theme }: { children: any; theme?: string | ThemeObject }) {
  if (typeof theme === 'string') {
    return <Theme name={theme}>{children}</Theme>
  }

  if (typeof theme === 'object') {
    return <Theme theme={theme}>{children}</Theme>
  }

  return children
}
