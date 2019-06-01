import { ThemeObject, ThemeSet } from '@o/css'
import React, { useContext, useMemo } from 'react'

import { Theme } from './Theme'
import { ThemeContext, ThemeContextType } from './ThemeContext'

type ThemeProvideProps = {
  activeTheme?: string
  themes: ThemeSet
  children: React.ReactNode
}

export function ThemeProvide({ activeTheme, children, themes }: ThemeProvideProps) {
  const themeContext = useContext(ThemeContext)

  const val: ThemeContextType = useMemo(() => {
    return {
      ...themeContext,
      allThemes: { ...themeContext.allThemes, ...themes } as ThemeObject,
    }
  }, [themeContext, themes])

  if (!Object.keys(themes).length) {
    console.error('No themes provided! Please provide a theme to ThemeProvide.')
    return null
  }

  return (
    <ThemeContext.Provider key={weakKey(themes)} value={val as any}>
      <Theme name={activeTheme}>{children}</Theme>
    </ThemeContext.Provider>
  )
}

const cache = new WeakMap()
const weakKey = val => {
  if (cache.has(val)) return cache.get(val)
  let next = Math.random()
  cache.set(val, next)
  return next
}
