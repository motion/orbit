import { ThemeObject } from '@o/css'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'

import { Config } from '../configureGloss'
import { CompiledTheme } from './createTheme'
import { ThemeContext, ThemeContextType } from './ThemeContext'
import { ThemeObservable, useProvideThemeObservable } from './ThemeObservable'
import { ThemeVariableContext } from './ThemeVariableManager'

export type ThemeSelect = ((theme: CompiledTheme) => CompiledTheme) | string | false | undefined

type ThemeProps = {
  theme?: string | CompiledTheme
  themeSubSelect?: ThemeSelect
  coat?: string | false
  name?: string
  children: any
}

export const Theme = (props: ThemeProps) => {
  const { theme, name, children } = props
  const nextName = (typeof name === 'string' && name) || (typeof theme === 'string' && theme) || ''
  const prev = useContext(ThemeContext)
  if (prev.allThemes[nextName]) {
    return <ThemeByName name={nextName}>{children}</ThemeByName>
  }
  const next = getNextTheme(props, prev)
  return <ThemeProvideHelper themeContext={next}>{children}</ThemeProvideHelper>
}

function ThemeProvideHelper(props: { themeContext: ThemeContextType; children: any }) {
  const themeObservableContext = useProvideThemeObservable(props)
  return (
    <ThemeVariableContext theme={props.themeContext.activeTheme}>
      <ThemeContext.Provider value={props.themeContext}>
        <ThemeObservable.Provider value={themeObservableContext}>
          {props.children}
        </ThemeObservable.Provider>
      </ThemeContext.Provider>
    </ThemeVariableContext>
  )
}

const themeCache = new WeakMap<any, ThemeContextType>()
const themeCoatCache = new WeakMap<any, { [coatName: string]: ThemeContextType }>()

function getNextTheme(props: ThemeProps, prev: ThemeContextType): ThemeContextType {
  const { theme, coat } = props
  if (typeof theme === 'object' && themeCache.has(theme)) {
    return themeCache.get(theme) as ThemeContextType
  }

  // getting the alt theme or create theme
  let previousOriginalTheme = prev.activeTheme

  if (coat) {
    const coatCache = themeCoatCache.get(previousOriginalTheme)
    if (coatCache && coatCache[coat]) {
      return coatCache[coat]!
    }
  }

  // if coat is defined and were already on coat, swap to original theme before going to new alternate
  if (typeof coat !== 'undefined') {
    previousOriginalTheme = prev.activeTheme._originalTheme || prev.activeTheme
  }

  let nextTheme

  if (coat || props.themeSubSelect) {
    nextTheme = Config.preProcessTheme
      ? Config.preProcessTheme(props, previousOriginalTheme)
      : prev.activeTheme
    let coatCache = themeCoatCache.get(previousOriginalTheme)

    // set coatCache
    if (coat) {
      if (!coatCache) {
        themeCoatCache.set(previousOriginalTheme, {})
        coatCache = themeCoatCache.get(previousOriginalTheme)
      }
      coatCache![coat] = createThemeContext(props, prev, nextTheme)
      return coatCache![coat]
    }
  } else {
    nextTheme = props.theme
  }

  if (!nextTheme || nextTheme === prev.activeTheme) {
    return prev
  }

  const next = createThemeContext(props, prev, nextTheme)
  themeCache.set(nextTheme, next)
  return next
}

const cacheByName = {}
function createThemeContext(
  props: ThemeProps,
  prev: ThemeContextType,
  next: ThemeObject,
): ThemeContextType {
  const activeThemeName = `${prev.activeThemeName}.${props.coat || props.themeSubSelect}`
  if (cacheByName[activeThemeName]) {
    return cacheByName[activeThemeName]
  }
  cacheByName[activeThemeName] = {
    ...prev,
    activeThemeName,
    activeTheme: next,
  }
  return cacheByName[activeThemeName]
}

function ThemeByName({ name, children }: ThemeProps) {
  const { allThemes } = React.useContext(ThemeContext)
  const themeMemo = useMemo(() => {
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
    themeCache.set(nextTheme, next)
    return next
  }, [name])

  return <ThemeProvideHelper themeContext={themeMemo}>{children}</ThemeProvideHelper>
}
