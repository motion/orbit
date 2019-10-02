import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'

import { Config } from '../configureGloss'
import { CompiledTheme } from './createTheme'
import { CurrentThemeContext, useProvideCurrentTheme } from './CurrentThemeContext'
import { AllThemes, AllThemesContext } from './ThemeContext'
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
  const themes = useContext(AllThemesContext)
  const cur = useContext(CurrentThemeContext).current
  if (!theme && !name && !props.themeSubSelect && !props.coat) {
    return children
  }
  const next = themes[nextName] || getNextTheme(props, cur)
  return <ThemeProvideHelper theme={next}>{children}</ThemeProvideHelper>
}

function ThemeProvideHelper(props: { theme: CompiledTheme; children: any }) {
  const themeObservableContext = useProvideCurrentTheme(props)
  return (
    <ThemeVariableContext theme={props.theme}>
      <CurrentThemeContext.Provider value={themeObservableContext}>
        {props.children}
      </CurrentThemeContext.Provider>
    </ThemeVariableContext>
  )
}

const themeCache = new WeakMap<any, AllThemes>()
const themeCoatCache = new WeakMap<any, { [coatName: string]: AllThemes }>()

function getNextTheme(props: ThemeProps, curTheme: CompiledTheme): CompiledTheme {
  const { theme, coat } = props
  if (typeof theme === 'object' && themeCache.has(theme)) {
    return themeCache.get(theme)!
  }

  // getting the alt theme or create theme
  let previousOriginalTheme = curTheme

  if (coat) {
    const coatCache = themeCoatCache.get(previousOriginalTheme)
    if (coatCache && coatCache[coat]) {
      return coatCache[coat]!
    }
  }

  // if coat is defined and were already on coat, swap to original theme before going to new alternate
  if (typeof coat !== 'undefined') {
    previousOriginalTheme = curTheme._originalTheme || curTheme
  }

  let nextTheme

  if (coat || props.themeSubSelect) {
    nextTheme = Config.preProcessTheme
      ? Config.preProcessTheme(props, previousOriginalTheme)
      : curTheme
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

  if (!nextTheme || nextTheme === curTheme) {
    return curTheme
  }

  const next = nextTheme
  themeCache.set(nextTheme, next)
  return next
}
