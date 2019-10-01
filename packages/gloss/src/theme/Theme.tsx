import { ThemeObject } from '@o/css'
import { uniqueId } from 'lodash'
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

const themeCache = new WeakMap<any, ThemeContextType>()

export const Theme = (props: ThemeProps) => {
  const { theme, name, children } = props
  const nextName = (typeof name === 'string' && name) || (typeof theme === 'string' && theme) || ''
  const prev = useContext(ThemeContext)
  if (prev.allThemes[nextName]) {
    return <ThemeByName name={nextName}>{children}</ThemeByName>
  }
  const next = getNextTheme(props, prev)
  return <ThemeProvideHelper themeContext={next || prev}>{children}</ThemeProvideHelper>
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

function getNextTheme(props: ThemeProps, prev: ThemeContextType) {
  const { theme, coat } = props
  let next: any = null

  if (typeof theme === 'object' && themeCache.has(theme)) {
    next = themeCache.get(theme) as ThemeContextType
  } else {
    // getting the alt theme or create theme
    let previousOriginalTheme = prev.activeTheme

    // if coat is defined and were already on coat, swap to original theme before going to new alternate
    if (typeof coat !== 'undefined') {
      previousOriginalTheme = prev.activeTheme._originalTheme || prev.activeTheme
    }

    let nextTheme

    if (coat || props.themeSubSelect) {
      nextTheme = Config.preProcessTheme
        ? Config.preProcessTheme(props, previousOriginalTheme)
        : prev.activeTheme
      next = themeCache.get(nextTheme)
    } else {
      nextTheme = props.theme
      if (!nextTheme) {
        return
      }
    }

    if (!next) {
      next = createThemeContext(props, prev, nextTheme)
      themeCache.set(nextTheme, next)
    }

    if (nextTheme === prev.activeTheme) {
      return
    }
  }

  return next
}

function createThemeContext(
  props: ThemeProps,
  prev: ThemeContextType,
  next: ThemeObject,
): ThemeContextType {
  const activeThemeName = `${prev.activeThemeName}.${props.coat ||
    props.themeSubSelect}.${uniqueId()}`
  return {
    ...prev,
    activeThemeName,
    activeTheme: next,
  }
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
