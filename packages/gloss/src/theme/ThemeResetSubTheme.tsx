import { useContext } from 'react'
import React from 'react'

import { CurrentThemeContext } from './CurrentThemeContext'
import { Theme } from './Theme'

export function ThemeResetSubTheme(props: { children: any }) {
  const theme = useContext(CurrentThemeContext).current
  return <Theme theme={theme.parent || theme}>{props.children}</Theme>
}
