import * as React from 'react'
import { ThemeObject } from '@mcro/css'

const themeContext = {
  allThemes: {},
  activeThemeName: null as string,
  activeTheme: null as ThemeObject,
}

export type ThemeContextType = typeof themeContext

export const ThemeContext = React.createContext(themeContext)
