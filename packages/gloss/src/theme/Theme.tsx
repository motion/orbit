import { ThemeObject } from '@o/css'
import React, { useContext, useMemo } from 'react'

import { Config } from '../config'
import { ThemeContext, ThemeContextType } from './ThemeContext'
import { SimpleStyleObject } from './ThemeMaker'

export type ThemeSelect = ((theme: ThemeObject) => ThemeObject) | string | false | undefined

type ThemeProps = {
  theme?: string | SimpleStyleObject
  themeSelect?: ThemeSelect
  alt?: string
  name?: string
  children: any
}

const themeContexts = new WeakMap()

export const Theme = (props: ThemeProps) => {
  const { theme, name, children } = props
  const nextName = (typeof name === 'string' && name) || (typeof theme === 'string' && theme) || ''
  const prev = useContext(ThemeContext)

  if (prev.allThemes[nextName]) {
    if (prev.allThemes[nextName] === prev.activeTheme) {
      return children
    }
    return <ThemeByName name={nextName}>{children}</ThemeByName>
  }

  const nextTheme = Config.preProcessTheme
    ? Config.preProcessTheme(props, prev.activeTheme)
    : prev.activeTheme
  let nextThemeObj: ThemeContextType = themeContexts.get(nextTheme)

  if (!nextThemeObj) {
    nextThemeObj = createThemeFromObject(props, prev, nextTheme)
    themeContexts.set(nextTheme, nextThemeObj)
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
  const activeThemeName = `${prev.activeThemeName}.${props.alt || props.themeSelect}`
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
