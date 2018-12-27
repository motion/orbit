import * as React from 'react'
import { ThemeContext } from './ThemeContext'
import { ThemeMaker, SimpleStyleObject } from './ThemeMaker'
import { selectThemeSubset } from '../helpers/selectThemeSubset'
import { ThemeObject } from '@mcro/css'

const MakeTheme = new ThemeMaker()
const makeName = () => `theme-${Math.random}`.slice(0, 15)
const baseThemeName = makeName()
const themeCache = {}

export type ThemeSelect = ((theme: ThemeObject) => ThemeObject) | string

type ThemeProps = {
  theme?: string | SimpleStyleObject
  name?: string
  select?: ThemeSelect
  children: any
}

// takes gloss themes and adds a "generate from base object/color"

// TODO: this just re-mounts everything below it on every render (when used with an object)?....
// TODO: the uniqeThemeName stuff is super wierd maybe not necessary

export const Theme = React.memo(({ theme, name, select, children }: ThemeProps) => {
  if (typeof name !== 'undefined') {
    return <ChangeThemeByName name={name}>{children}</ChangeThemeByName>
  }

  // pass through if no theme
  if (!select && !(theme || name)) {
    return children
  }

  // get next theme
  let nextTheme
  let uniqThemeName = baseThemeName

  // make theme right here from a color string...
  if (typeof theme === 'string') {
    // theme from color string
    if (!themeCache[theme]) {
      // cache themes, we can't have that many right...
      themeCache[theme] = MakeTheme.fromColor(theme)
      uniqThemeName = theme
    }
    nextTheme = themeCache[theme]
  } else if (!!theme) {
    // theme from object
    nextTheme = MakeTheme.fromStyles(theme)
    uniqThemeName = makeName()
  }

  const contextTheme = React.useContext(ThemeContext)

  // function to select a sub-theme object
  if (select) {
    if (typeof select === 'string') {
      nextTheme = selectThemeSubset(select, contextTheme.activeTheme)
    } else {
      nextTheme = select(contextTheme.activeTheme)
    }
    uniqThemeName = makeName()
  }

  return (
    <ThemeContext.Provider
      value={{
        allThemes: {
          ...contextTheme.allThemes,
          [uniqThemeName]: nextTheme,
        },
        activeThemeName: uniqThemeName,
        activeTheme: nextTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
})

export const ChangeThemeByName = React.memo(
  ({ name, children }: { name: string; children: any }) => {
    if (!name) {
      return children
    }
    const { allThemes } = React.useContext(ThemeContext)
    if (!allThemes || !allThemes[name]) {
      throw new Error(`No theme in context: ${name}. Themes are: ${Object.keys(allThemes)}`)
    }
    return (
      <ThemeContext.Provider
        value={{
          allThemes,
          activeTheme: allThemes[name],
          activeThemeName: name,
        }}
      >
        {children}
      </ThemeContext.Provider>
    )
  },
)
