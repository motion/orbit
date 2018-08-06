import * as React from 'react'
import { ThemeContext } from './ThemeContext'
import { ThemeObject } from '../types'

type ThemeProvideProps = {
  activeTheme?: string
  themes: {
    [key: string]: ThemeObject
  }
  children: React.ReactNode
}

export const ThemeProvide = ({
  activeTheme,
  children,
  themes,
}: ThemeProvideProps) => {
  if (!Object.keys(themes).length) {
    throw new Error('No themes provided')
  }
  return (
    <ThemeContext.Consumer>
      {themeContext => {
        const val = {
          ...themeContext,
          allThemes: { ...themeContext.allThemes, ...themes },
        }
        if (activeTheme) {
          val.activeThemeName = activeTheme
        }
        return (
          <ThemeContext.Provider value={val}>{children}</ThemeContext.Provider>
        )
      }}
    </ThemeContext.Consumer>
  )
}
