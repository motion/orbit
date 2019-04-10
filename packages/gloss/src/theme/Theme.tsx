import { ThemeObject } from '@o/css'
import React, { useContext, useMemo } from 'react'
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

export function Theme(props: ThemeProps) {
  const { alternate, theme, name, select, children } = props
  const nextName = (typeof name === 'string' && name) || (typeof theme === 'string' && theme) || ''
  const contextTheme = useContext(ThemeContext)

  if (contextTheme.allThemes[nextName]) {
    return <ThemeByName name={nextName}>{children}</ThemeByName>
  }

  if (typeof alternate === 'string') {
    return <ThemeByAlternate {...props} />
  }

  // pass through if no theme
  if (!select && !(theme || name)) {
    return children
  }

  return <ThemeByObject {...props} />
}

function ThemeByAlternate(props: ThemeProps) {
  const contextTheme = useContext(ThemeContext)
  const { alternate, children } = props
  const memoValue = useMemo(() => {
    const next = getAlternateTheme(alternate, contextTheme.activeTheme)
    const nextName = `${contextTheme.activeThemeName}.${alternate}`
    return {
      ...contextTheme,
      activeThemeName: nextName,
      activeTheme: next,
    }
  }, [alternate])

  return <ThemeContext.Provider value={memoValue}>{children}</ThemeContext.Provider>
}

function ThemeByObject(props: ThemeProps) {
  const { theme, select, children } = props
  const contextTheme = useContext(ThemeContext)
  const memoValue = useMemo(() => {
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

    return {
      allThemes: {
        ...contextTheme.allThemes,
        [uniqThemeName]: nextTheme,
      },
      activeThemeName: uniqThemeName,
      activeTheme: nextTheme,
    }
  }, [theme, select])
  return <ThemeContext.Provider value={memoValue}>{children}</ThemeContext.Provider>
}

function ThemeByName({ name, children }: ThemeProps) {
  const { activeTheme, allThemes } = React.useContext(ThemeContext)
  const memoValue = useMemo(() => {
    if (!name) {
      return children
    }
    if (!allThemes || !allThemes[name]) {
      throw new Error(`No theme in context: ${name}. Themes are: ${Object.keys(allThemes)}`)
    }
    const nextTheme = proxyParentTheme(activeTheme, allThemes[name])
    return {
      allThemes,
      activeTheme: nextTheme,
      activeThemeName: name,
    }
  }, [name])
  return <ThemeContext.Provider value={memoValue}>{children}</ThemeContext.Provider>
}

function proxyParentTheme(parent: ThemeObject | null | undefined, next: ThemeObject) {
  if (!parent) {
    return next
  }
  return next
  // could be an option...
  // return new Proxy(next, {
  //   get(target, key) {
  //     return Reflect.get(target, key) || Reflect.get(parent, key)
  //   },
  // })
}
