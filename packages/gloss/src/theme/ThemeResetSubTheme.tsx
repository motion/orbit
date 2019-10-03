import { useContext } from 'react'
import React from 'react'

import { CurrentThemeContext, getThemeContainer } from './Theme'

export function ThemeResetSubTheme({ children }: { children: any }) {
  const theme = useContext(CurrentThemeContext).current
  if (theme.parent) {
    return getThemeContainer({ children, theme: theme.parent })
  }
  return children
}
