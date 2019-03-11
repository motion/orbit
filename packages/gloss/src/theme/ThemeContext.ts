import { ThemeObject } from '@o/css'
import * as React from 'react'

const themeContext = {
  allThemes: {} as { [key: string]: ThemeObject },
  activeThemeName: null as string,
  activeTheme: null as ThemeObject,
}

export type ThemeContextType = typeof themeContext

export const ThemeContext = React.createContext(themeContext)
