import { ThemeObject } from '@o/css'
import * as React from 'react'

export type ThemeContextType = {
  allThemes: { [key: string]: ThemeObject }
  activeThemeName: string
  activeTheme: ThemeObject
}

const themeContext: ThemeContextType = {
  allThemes: {},
  activeThemeName: '',
  activeTheme: {} as any,
}

export const ThemeContext = React.createContext(themeContext)
