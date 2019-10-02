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
  const themes = useContext(ThemeContext)
  const cur = useContext(ThemeObservable).current
  if (themes[nextName]) {
    return <ThemeProvideHelper theme={themes[nextName]}>{children}</ThemeProvideHelper>
  }
  const next = getNextTheme(props, cur)
  return <ThemeProvideHelper theme={next}>{children}</ThemeProvideHelper>
}

function ThemeProvideHelper(props: { theme: CompiledTheme; children: any }) {
  const themeObservableContext = useProvideThemeObservable(props)
  return (
    <ThemeVariableContext theme={props.theme}>
      <ThemeObservable.Provider value={themeObservableContext}>
        {props.children}
      </ThemeObservable.Provider>
    </ThemeVariableContext>
  )
}

const themeCache = new WeakMap<any, ThemeContextType>()
const themeCoatCache = new WeakMap<any, { [coatName: string]: ThemeContextType }>()

function getNextTheme(props: ThemeProps, prev: CompiledTheme): CompiledTheme {
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
      coatCache![coat] = nextTheme
      return coatCache![coat]
    }
  } else {
    nextTheme = props.theme
  }

  if (!nextTheme || nextTheme === prev.activeTheme) {
    return prev
  }

  const next = nextTheme
  themeCache.set(nextTheme, next)
  return next
}
