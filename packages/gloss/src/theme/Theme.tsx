import { ThemeObject } from '@o/css'
import * as React from 'react'
import { getAlternateTheme } from '../helpers/preProcessTheme'
import { selectThemeSubset } from '../helpers/selectThemeSubset'
import { ThemeContext } from './ThemeContext'
import { SimpleStyleObject, ThemeMaker } from './ThemeMaker'

const MakeTheme = new ThemeMaker()
const makeName = () => `theme-${Math.random}`.slice(0, 15)
const baseThemeName = makeName()
const themeCache = {}

export type ThemeSelect = ((theme: ThemeObject) => ThemeObject) | string | false | undefined

type ThemeProps = {
  theme?: string | SimpleStyleObject
  name?: string
  select?: ThemeSelect
  children: any
  alternate?: string
}

function proxyParentTheme(parent: ThemeObject, next: ThemeObject) {
  return new Proxy(next, {
    get(target, key) {
      return Reflect.get(target, key) || Reflect.get(parent, key)
    },
  })
}

// takes gloss themes and adds a "generate from base object/color"

// TODO: this just re-mounts everything below it on every render (when used with an object)?....
// TODO: the uniqeThemeName stuff is super wierd maybe not necessary

export function Theme({ alternate, theme, name, select, children }: ThemeProps) {
  const contextTheme = React.useContext(ThemeContext)

  if (typeof name !== 'undefined') {
    return <ChangeThemeByName name={name}>{children}</ChangeThemeByName>
  }

  if (typeof alternate === 'string') {
    const next = getAlternateTheme(alternate, contextTheme.activeTheme)
    const nextName = `${contextTheme.activeThemeName}.${alternate}`
    return (
      <ThemeContext.Provider
        value={{
          ...contextTheme,
          activeThemeName: nextName,
          activeTheme: next,
        }}
      >
        {children}
      </ThemeContext.Provider>
    )
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

  // function to select a sub-theme object
  if (select) {
    if (typeof select === 'string') {
      nextTheme = selectThemeSubset(select, contextTheme.activeTheme)
    } else {
      nextTheme = select(contextTheme.activeTheme) || contextTheme.activeTheme
    }
    uniqThemeName = makeName()
  }

  // inherit from previous theme
  // this could be easily configurable
  nextTheme = proxyParentTheme(contextTheme.activeTheme, nextTheme)

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
}

export const ChangeThemeByName = React.memo(
  ({ name, children }: { name: string; children: any }) => {
    const { activeTheme, allThemes } = React.useContext(ThemeContext)
    if (!name) {
      return children
    }
    if (!allThemes || !allThemes[name]) {
      throw new Error(`No theme in context: ${name}. Themes are: ${Object.keys(allThemes)}`)
    }

    const nextTheme = activeTheme ? proxyParentTheme(activeTheme, allThemes[name]) : allThemes[name]

    return (
      <ThemeContext.Provider
        value={{
          allThemes,
          activeTheme: nextTheme,
          activeThemeName: name,
        }}
      >
        {children}
      </ThemeContext.Provider>
    )
  },
)
