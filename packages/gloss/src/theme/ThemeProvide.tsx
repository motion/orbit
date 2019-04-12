import { ThemeSet } from '@o/css'
import React, { useContext, useMemo } from 'react'
import { ThemeContext } from './ThemeContext'

type ThemeProvideProps = {
  activeTheme?: string
  themes: ThemeSet
  children: React.ReactNode
}

export function ThemeProvide({ activeTheme, children, themes }: ThemeProvideProps) {
  const themeContext = useContext(ThemeContext)
  const val = useMemo(() => {
    const next = {
      ...themeContext,
      allThemes: { ...themeContext.allThemes, ...themes },
    }
    if (activeTheme) {
      next.activeThemeName = activeTheme
    }
    return next
  }, [themeContext, activeTheme])

  if (!Object.keys(themes).length) {
    console.error('No themes provided! Please provide a theme to ThemeProvide.')
    return null
  }

  return <ThemeContext.Provider value={val as any}>{children}</ThemeContext.Provider>
}
