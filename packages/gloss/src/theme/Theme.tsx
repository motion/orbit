import React, { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef } from 'react'

import { CompiledTheme } from './createTheme'
import { preProcessTheme } from './preProcessTheme'
import { AllThemesContext } from './ThemeContext'
import { themeVariableManager } from './themeVariableManager'

export type ThemeSelect = ((theme: CompiledTheme) => CompiledTheme) | string | false | undefined
export type ThemeObserver = (theme: CompiledTheme) => any
type ThemeSubscriber = (onChange: ThemeObserver) => { unsubscribe: () => void }

export type CurrentTheme = {
  subscribe: ThemeSubscriber
  current: CompiledTheme
  parentContext?: CurrentTheme
}

type ThemeProps = {
  theme?: CompiledTheme
  themeSubSelect?: ThemeSelect
  coat?: string | false
  name?: string
  children: React.ReactNode
}

export const Theme = (props: ThemeProps) => {
  const theme = getNextTheme(props)
  const themeObservableContext = useCreateThemeObservable({ theme: theme! })
  const nodeRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (themeObservableContext && theme) {
      const setClassName = () => {
        const classNames = themeVariableManager.getClassNames(theme)
        if (nodeRef.current) {
          nodeRef.current.className = classNames.join(' ')
        }
      }

      setClassName()
      const themeListen = themeObservableContext.subscribe(setClassName)

      themeVariableManager.mount(theme)
      return () => {
        themeVariableManager.unmount(theme)
        themeListen.unsubscribe()
      }
    }
  }, [theme])

  if (!theme || !themeObservableContext) {
    return props.children as JSX.Element
  }

  return (
    <CurrentThemeContext.Provider value={themeObservableContext}>
      <div ref={nodeRef} style={{ display: 'contents' }}>
        {props.children}
      </div>
    </CurrentThemeContext.Provider>
  )
}

const getNextTheme = (props: ThemeProps) => {
  const { name, theme, themeSubSelect, coat } = props
  const themes = useContext(AllThemesContext)
  const curContext = useContext(CurrentThemeContext)
  if (!name && !themeSubSelect && !coat && !theme) {
    return
  }
  return (name && themes[name]) || preProcessTheme(props, curContext.current)
}

export const CurrentThemeContext = createContext<CurrentTheme>({
  subscribe: _ => ({ unsubscribe: () => {} }),
  current: null as any,
})

export function useCreateThemeObservable(props: { theme: CompiledTheme }) {
  const parentContext = useContext(CurrentThemeContext)
  const themeObservers = useRef<Set<ThemeObserver>>(new Set())

  // never change this just emit
  const context: CurrentTheme | null = useMemo(() => {
    if (!props.theme) {
      return null
    }
    return {
      parentContext,
      current: props.theme,
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

  useLayoutEffect(() => {
    if (context) {
      if (context.current !== props.theme) {
        context.current = props.theme
        themeObservers.current.forEach(cb => {
          cb(props.theme)
        })
      }
    }
  }, [props.theme])

  return context
}
