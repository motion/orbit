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
  subTheme?: ThemeSelect
  coat?: string | false
  name?: string
  children: React.ReactNode
}

export const Theme = (props: ThemeProps) => {
  const theme = useNextTheme(props)
  const themeObservableContext = useCreateThemeObservable({ theme })
  const nodeRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    // hasnt changed
    if (!themeObservableContext) return
    const setClassName = () => {
      const classNames = themeVariableManager.getClassNames(themeObservableContext.current)
      if (nodeRef.current) {
        nodeRef.current.className = `display-contents ${classNames}`
      }
    }
    setClassName()
    const themeListen = themeObservableContext.subscribe(setClassName)
    themeVariableManager.mount(themeObservableContext)
    return () => {
      themeVariableManager.unmount(themeObservableContext)
      themeListen.unsubscribe()
    }
  }, [theme])

  if (!themeObservableContext || (!props.coat && !props.theme && !props.subTheme && !props.name)) {
    return props.children as JSX.Element
  }

  return (
    <CurrentThemeContext.Provider value={themeObservableContext}>
      <div ref={nodeRef} className="display-contents" style={{ display: 'contents' }}>
        {props.children}
      </div>
    </CurrentThemeContext.Provider>
  )
}

const useNextTheme = (props: ThemeProps) => {
  const { name, theme, subTheme, coat } = props
  const themes = useContext(AllThemesContext)
  const curContext = useContext(CurrentThemeContext)
  if (!name && !subTheme && !coat && !theme) {
    return
  }
  return (name && themes[name]) || preProcessTheme(props, curContext.current)
}

// much lighter weight for simple use case
export const ThemeByName = (props: { name?: string; children: React.ReactNode }) => {
  const curContext = useContext(CurrentThemeContext)
  return (
    <div
      style={{ display: 'contents' }}
      className={`display-contents theme-${props.name || getNonSubThemeName(curContext)}`}
    >
      {props.children}
    </div>
  )
}

const getNonSubThemeName = (cur: CurrentTheme) => {
  while (true) {
    if (cur.parentContext && (cur.current._isCoat || cur.current._isSubTheme)) {
      cur = cur.parentContext
    } else {
      break
    }
  }
  return cur.current.name
}

export const CurrentThemeContext = createContext<CurrentTheme>({
  subscribe: _ => ({ unsubscribe: () => {} }),
  current: null as any,
})

function useCreateThemeObservable(props: { theme?: CompiledTheme }) {
  const themeObservers = useRef<Set<ThemeObserver>>(new Set())
  const parentContext = useContext(CurrentThemeContext)

  // never change this just emit
  const context: CurrentTheme | null = useMemo(() => {
    if (!props.theme) {
      return parentContext
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
    if (context && props.theme) {
      if (context.current !== props.theme) {
        context.current = props.theme
        themeObservers.current.forEach(cb => {
          props.theme && cb(props.theme)
        })
      }
    }
  }, [props.theme])

  return context
}
