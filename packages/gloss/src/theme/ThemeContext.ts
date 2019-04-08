import { ThemeObject, toColor } from '@o/css'
import * as React from 'react'

type ThemeContextType = {
  allThemes: { [key: string]: ThemeObject }
  activeThemeName: string
  activeTheme: ThemeObject
}

const themeContext: ThemeContextType = {
  allThemes: {},
  activeThemeName: '',
  activeTheme: {
    background: toColor('#fff'),
    color: toColor('#000'),
    borderColor: toColor('#eee'),
  },
}

export const ThemeContext = React.createContext(themeContext)
