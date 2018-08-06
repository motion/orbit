import * as React from 'react'
import { ThemeContext } from './ThemeContext'
import { ThemeMaker } from './ThemeMaker'

const MakeTheme = new ThemeMaker()
const uniqThemeName = `theme-${Math.random}`.slice(0, 15)
const themeCache = {}

// takes gloss themes and adds a "generate from base object/color"

// TODO: this just re-mounts everything below it on every render (when used with an object)?....

export const Theme = ({ theme, name, children }) => {
  if (name) {
    return <ChangeThemeByName name={name}>{children}</ChangeThemeByName>
  }
  // pass through if no theme
  if (!theme) {
    return children
  }
  const isString = typeof theme === 'string'
  let nextTheme
  if (isString) {
    // cache themes, we can't have that many right...
    if (!themeCache[theme]) {
      themeCache[theme] = MakeTheme.fromColor(theme)
    }
    nextTheme = themeCache[theme]
  } else {
    nextTheme = MakeTheme.fromStyles(theme)
  }
  return (
    <ThemeContext.Consumer>
      {theme => (
        <ThemeContext.Provider
          value={{
            allThemes: {
              ...theme.allThemes,
              [uniqThemeName]: nextTheme,
            },
            activeThemeName: uniqThemeName,
            activeTheme: nextTheme,
          }}
        >
          {children}
        </ThemeContext.Provider>
      )}
    </ThemeContext.Consumer>
  )
}

export const ChangeThemeByName = ({ name, children }) => {
  if (!name) {
    throw new Error('No name provided to theme')
  }
  return (
    <ThemeContext.Consumer>
      {({ allThemes }) => {
        if (!allThemes || !allThemes[name]) {
          throw new Error(
            `No theme in context: ${name}. Themes are: ${Object.keys(
              allThemes,
            )}`,
          )
        }
        const activeTheme = allThemes[name]
        return (
          <ThemeContext.Provider
            value={{
              allThemes,
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
