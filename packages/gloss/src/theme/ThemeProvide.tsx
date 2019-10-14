import { ThemeSet } from '@o/css'
import React from 'react'

import { createThemes } from './createTheme'
import { Theme } from './Theme'
import { AllThemesContext } from './ThemeContext'

type ThemeProvideProps = {
  activeTheme: string
  themes: ThemeSet
  children: React.ReactNode
}

export function ThemeProvide({ activeTheme, children, themes }: ThemeProvideProps) {
  if (!Object.keys(themes).length) {
    console.error('No themes provided! Please provide a theme to ThemeProvide.')
    return null
  }
  return (
    <AllThemesContext.Provider value={createThemes(themes)}>
      <Theme name={activeTheme}>{children}</Theme>
    </AllThemesContext.Provider>
  )
}
