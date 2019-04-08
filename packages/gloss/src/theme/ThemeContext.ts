import { ThemeObject } from '@o/css'
import * as React from 'react'

type ThemeContextType = {
  allThemes: { [key: string]: ThemeObject }
  activeThemeName: string
  activeTheme: ThemeObject
}

const themeContext: ThemeContextType = {
  allThemes: {},
  activeThemeName: '',
  activeTheme: null,
}

export const ThemeContext = React.createContext(themeContext)
