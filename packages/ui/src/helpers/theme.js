import * as React from 'react'
import { Theme as GlossTheme, ThemeContext } from '@mcro/gloss'
import { ThemeMaker } from './themeMaker'

const MakeTheme = new ThemeMaker()
const uniqThemeName = `theme-${Math.random}`.slice(0, 15)

// takes gloss themes and adds a "generate from base object/color"

export const Theme = ({ theme, name, children }) => {
  if (name) {
    return <GlossTheme name={name}>{children}</GlossTheme>
  }
  // pass through if no theme
  if (!theme || !name) {
    return children
  }
  const nextTheme =
    typeof theme === 'string'
      ? MakeTheme.fromColor(theme)
      : MakeTheme.fromStyles(theme)
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
