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

  if (typeof theme === 'object' && cacheThemes.has(theme)) {
    return cacheThemes.get(theme)
  }

  const nextTheme = Config.preProcessTheme
    ? Config.preProcessTheme(props, prev.activeTheme)
    : prev.activeTheme
  let nextThemeObj = cacheThemes.get(nextTheme)

  if (!nextThemeObj) {
    nextThemeObj = createThemeFromObject(props, prev, nextTheme)
    cacheThemes.set(nextTheme, nextThemeObj)
    console.log('making theme', props, nextThemeObj)
  }

  if (nextTheme === prev.activeTheme) {
    return children
  }

  return <ThemeContext.Provider value={nextThemeObj}>{children}</ThemeContext.Provider>
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
    return {
      allThemes,
      activeTheme: nextTheme,
      activeThemeName: name,
    }
  }, [name])
  return <ThemeContext.Provider value={memoValue}>{children}</ThemeContext.Provider>
}
