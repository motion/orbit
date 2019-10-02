import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'

import { Config } from '../configureGloss'
import { CompiledTheme } from './createTheme'
import { CurrentThemeContext, useProvideCurrentTheme } from './CurrentThemeContext'
import { AllThemesContext } from './ThemeContext'
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

const themeCache = new WeakMap<CompiledTheme, CompiledTheme>()
const themeAltCache = new WeakMap<CompiledTheme, { [key: string]: CompiledTheme }>()

function getNextTheme(props: ThemeProps, curTheme: CompiledTheme): CompiledTheme {
  const { theme, coat } = props
  const altKey = `${props.coat || ''}-${
    typeof props.themeSubSelect === 'string' ? props.themeSubSelect : ''
  }`
  if (typeof theme === 'object') {
    if (themeCache.has(theme)) {
      return themeCache.get(theme)!
    }
    const altCache = themeAltCache.has(theme)
    if (altCache && altCache[altKey]) {
      return altCache[altKey]
    }
  }

  // if coat is defined and were already on coat, swap to original theme before going to new coat
  if (typeof coat !== 'undefined') {
    curTheme = curTheme._originalTheme || curTheme
  }

  let nextTheme: CompiledTheme | null = null

  if (coat || props.themeSubSelect) {
    nextTheme = Config.preProcessTheme ? Config.preProcessTheme(props, curTheme) : curTheme
    nextTheme = {
      ...nextTheme,
      name: `coat-${altKey}`,
    }
    if (!themeAltCache.has(curTheme)) {
      themeAltCache.set(curTheme, {})
    }
    const altCache = themeAltCache.get(curTheme)!
    altCache[altKey] = nextTheme
  } else {
    if (typeof theme === 'object') {
      nextTheme = theme
    }
  }
  if (!nextTheme || nextTheme === curTheme) {
    return curTheme
  }
  if (typeof theme === 'object') {
    themeCache.set(theme, nextTheme)
  }

  return nextTheme
}
