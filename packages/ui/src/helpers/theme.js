import * as React from 'react'
import { Theme as GlossTheme, ThemeContext } from '@mcro/gloss'
import { ThemeMaker } from './themeMaker'

const MakeTheme = new ThemeMaker()
const uniqThemeName = `theme-${Math.random}`.slice(0, 15)
const themeCache = {}

// takes gloss themes and adds a "generate from base object/color"

export const Theme = ({ theme, name, children }) => {
  if (name) {
    return <GlossTheme name={name}>{children}</GlossTheme>
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
