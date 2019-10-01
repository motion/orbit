import { ThemeObject } from '@o/css'
import { uniqueId } from 'lodash'
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

import { Contents } from '../blocks/Contents'
import { Config } from '../configureGloss'
import { makeStyleTag } from '../stylesheet/makeStyleTag'
import { CompiledTheme } from './createTheme'
import { ThemeContext, ThemeContextType } from './ThemeContext'

export type ThemeSelect = ((theme: ThemeObject) => ThemeObject) | string | false | undefined

type ThemeProps = {
  theme?: string | ThemeObject
  themeSubSelect?: ThemeSelect
  coat?: string | false
  name?: string
  children: any
}

const themeCache = new WeakMap<any, ThemeContextType>()

type ThemeObserver = (theme: CompiledTheme) => any
type ThemeObservable = (onChange: ThemeObserver) => { unsubscribe: () => void }
type ThemeObservableType = {
  subscribe: ThemeObservable
}

export const ThemeObservable = createContext<ThemeObservableType>({
  subscribe: _ => ({ unsubscribe: () => {} }),
})

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

  const next = getNextTheme(props, prev)
  if (!next || next === prev) {
    return children
  }
  return <ThemeProvideHelper themeContext={next}>{children}</ThemeProvideHelper>
}

function ThemeProvideHelper(props: { themeContext: ThemeContextType; children: any }) {
  const themeObservers = useRef<Set<ThemeObserver>>(new Set())

  // never change this just emit
  const themeObservableContext: ThemeObservableType = useMemo(() => {
    return {
      subscribe: cb => {
        themeObservers.current.add(cb)
        return {
          unsubscribe: () => {
            themeObservers.current.delete(cb)
          },
        }
      },
    }
  }, [])

  useEffect(() => {
    themeObservers.current.forEach(cb => {
      cb(props.themeContext.activeTheme)
    })
  }, [props.themeContext])

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

class ThemeVariableManager {
  tag = makeStyleTag()
  mounted = new Map()

  get sheet() {
    return this.tag!.sheet! as CSSStyleSheet
  }

  mount(theme: CompiledTheme) {
    if (this.mounted.has(theme)) {
      this.mounted.set(theme, this.mounted.get(theme) + 1)
    } else {
      this.mounted.set(theme, 1)

      const className = this.getClassName(theme)
      let rule = `.${className} {`
      for (const key in theme) {
        const val = theme[key]
        if (val && val.cssVariable && val.getCSSValue) {
          const next = val.getCSSValue()
          if (typeof next === 'string') {
            rule += `--${val.cssVariable}: ${next};`
          }
        }
      }
      this.sheet.insertRule(rule)
    }
  }

  unmount(theme: CompiledTheme) {
    this.mounted.set(theme, (this.mounted.get(theme) || 1) - 1)
    // noop for now, not a big memory use
  }

  getClassName(theme: CompiledTheme) {
    return `theme-context-${theme.name}`
  }
}
const themeVariableManager = new ThemeVariableManager()

function ThemeVariableContext({ theme, children }: { theme: CompiledTheme; children: any }) {
  const className = themeVariableManager.getClassName(theme)

  useEffect(() => {
    themeVariableManager.mount(theme)
    return () => {
      themeVariableManager.unmount(theme)
    }
  }, [])

  return <Contents className={className}>{children}</Contents>
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
