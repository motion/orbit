import * as React from 'react'

import { CompiledTheme } from './createTheme'

export type ThemeContextType = {
  allThemes: { [key: string]: CompiledTheme }
  activeThemeName: string
  activeTheme: CompiledTheme
}

const themeContext: ThemeContextType = {
  allThemes: {},
  activeThemeName: '',
  activeTheme: {} as any,
}

export const ThemeContext = React.createContext(themeContext)
