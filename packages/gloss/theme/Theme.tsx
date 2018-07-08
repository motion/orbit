import * as React from 'react'
import { ThemeContext } from './ThemeContext'

export const Theme = ({ name, children }) => {
  if (!name) {
    throw new Error('No name provided to theme')
  }
  return (
    <ThemeContext.Consumer>
      {({ allThemes }) => {
        if (!allThemes || !allThemes[name]) {
          throw new Error(`No ${name} theme in context!`)
        }
        const activeTheme = allThemes[name]
        return (
          <ThemeContext.Provider
            value={{
              allThemes: { ...allThemes, [name]: activeTheme },
              activeTheme,
              activeThemeName: name,
            }}
          >
            {children}
          </ThemeContext.Provider>
        )
      }}
    </ThemeContext.Consumer>
  )
}
