import { useContext } from 'react'
import React from 'react'

import { CurrentThemeContext } from './CurrentThemeContext'
import { getThemeContainer } from './ThemeVariableManager'

export function ThemeResetSubTheme({ children }: { children: any }) {
  const theme = useContext(CurrentThemeContext).current
  if (theme.parent) {
    return getThemeContainer({ children, theme })
  }
  return children
}
