import * as React from 'react'
import { ThemeContext } from './ThemeContext'

export const ThemeProvide = ({ children, ...themes }) => {
  if (!Object.keys(themes).length) {
    throw new Error('No themes provided')
  }
  return (
    <ThemeContext.Provider value={{ allThemes: themes }}>
      {children}
    </ThemeContext.Provider>
  )
}
