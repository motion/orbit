import { ThemeObject } from '@o/css'
import { uniqueId } from 'lodash'
import React, { useContext, useEffect, useMemo } from 'react'

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

export const cacheThemes = new WeakMap<any, ThemeContextType>()

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
  return (
    <ThemeVariableContext theme={next.activeTheme}>
      <ThemeContext.Provider value={next}>{children}</ThemeContext.Provider>
    </ThemeVariableContext>
  )
}

function getNextTheme(props: ThemeProps, prev: ThemeContextType) {
  const { theme, coat } = props
  let next: any = null

  if (typeof theme === 'object' && cacheThemes.has(theme)) {
    next = cacheThemes.get(theme) as ThemeContextType
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
      next = cacheThemes.get(nextTheme)
    } else {
      nextTheme = props.theme
      if (!nextTheme) {
        return
      }
    }

    if (!next) {
      next = createThemeFromObject(props, prev, nextTheme)
      cacheThemes.set(nextTheme, next)
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

  mount(theme: CompiledTheme) {
    if (this.mounted.has(theme)) {
      this.mounted.set(theme, this.mounted.get(theme) + 1)
    } else {
      this.mounted.set(theme, 1)
      // insert rules
      const rootName = this.getClassName(theme)
      const insert = this.tag!.sheet!['insertRule']
      const rules: any = {}
      for (const key in theme) {
        const val = theme[key]
        if (val && val.cssVariable && val.getCSSValue) {
          const next = val.getCSSValue()
          if (typeof next === 'string') {
            rules[val.cssVariable] = next
          }
        }
      }

      console.log('rules', rules)
    }
  }

  unmount(_: CompiledTheme) {
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

function createThemeFromObject(
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
