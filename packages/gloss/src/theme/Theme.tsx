import { ThemeObject } from '@o/css'
import { uniqueId } from 'lodash'
import React, { useContext, useMemo } from 'react'

import { Config } from '../config'
import { ThemeContext, ThemeContextType } from './ThemeContext'

export type ThemeSelect = ((theme: ThemeObject) => ThemeObject) | string | false | undefined

type ThemeProps = {
  theme?: string | ThemeObject
  themeSelect?: ThemeSelect
  alt?: string
  name?: string
  children: any
}

export const cacheThemes = new WeakMap<any, ThemeContextType>()

export const Theme = (props: ThemeProps) => {
  const { theme, name, children, themeSelect, alt } = props
  const nextName = (typeof name === 'string' && name) || (typeof theme === 'string' && theme) || ''
  const prev = useContext(ThemeContext)

  if (!theme && !name && !themeSelect && !alt) {
    return children
  }

  if (prev.allThemes[nextName]) {
    if (prev.allThemes[nextName] === prev.activeTheme) {
      return children
    }
    return <ThemeByName name={nextName}>{children}</ThemeByName>
  }

  let next: any = null

  if (typeof theme === 'object' && cacheThemes.has(theme)) {
    next = cacheThemes.get(theme) as ThemeContextType
  } else {
    // getting the alt theme or create theme
    // this is doing some heavy work and is awkwardly named
    let previousOriginalTheme = prev.activeTheme._originalTheme || prev.activeTheme

    const nextTheme = Config.preProcessTheme
      ? Config.preProcessTheme(props, previousOriginalTheme)
      : prev.activeTheme

    next = cacheThemes.get(nextTheme)

    if (!next) {
      next = createThemeFromObject(props, prev, nextTheme)
      cacheThemes.set(nextTheme, next)
    }
    if (nextTheme === prev.activeTheme) {
      return children
    }
  }

  if (next === prev) {
    return children
  }

  return <ThemeContext.Provider value={next}>{children}</ThemeContext.Provider>
}

function createThemeFromObject(
  props: ThemeProps,
  prev: ThemeContextType,
  next: ThemeObject,
): ThemeContextType {
  const activeThemeName = `${prev.activeThemeName}.${props.alt || props.themeSelect}.${uniqueId()}`
  return {
    ...prev,
    activeThemeName,
    activeTheme: next,
  }
}

function ThemeByName({ name, children }: ThemeProps) {
  const { allThemes } = React.useContext(ThemeContext)
  const memoValue = useMemo(() => {
    if (!name) {
      return children
    }
    if (!allThemes || !allThemes[name]) {
      throw new Error(`No theme in context: ${name}. Themes are: ${Object.keys(allThemes)}`)
    }
    const nextTheme = allThemes[name]
    const next: ThemeContextType = {
      allThemes,
      activeTheme: nextTheme,
      activeThemeName: name,
    }

    cacheThemes.set(nextTheme, next)

    return next
  }, [name])
  return <ThemeContext.Provider value={memoValue}>{children}</ThemeContext.Provider>
}
