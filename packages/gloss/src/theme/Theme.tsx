import React, { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef } from 'react'

import { CompiledTheme } from './createTheme'
import { preProcessTheme } from './preProcessTheme'
import { AllThemesContext } from './ThemeContext'
import { themeVariableManager } from './ThemeVariableManager'

export type ThemeSelect = ((theme: CompiledTheme) => CompiledTheme) | string | false | undefined
export type ThemeObserver = (theme: CompiledTheme) => any
type ThemeSubscriber = (onChange: ThemeObserver) => { unsubscribe: () => void }

export type CurrentTheme = {
  subscribe: ThemeSubscriber
  current: CompiledTheme
  parentContext?: CurrentTheme
}

type ThemeChangeProps = {
  subTheme?: ThemeSelect
  coat?: string | false
  name?: string
}

type ThemeProps = ThemeChangeProps & {
  children: React.ReactNode
  [key: string]: any
}

export const Theme = (props: ThemeProps): JSX.Element => {
  const { coat, subTheme, name, children, ...themeVariables } = props
  const willChangeTheme = !!(coat || subTheme || name)
  const themeVarKeys = Object.keys(themeVariables)
  const hasThemeVariables = themeVarKeys.length
  const theme = useNextTheme({ coat, subTheme, name })
  const themeObservableContext = useCreateThemeObservable(theme)
  const nodeRef = useRef<HTMLDivElement>(null)

  // change theme by name, coat, subTheme
  useLayoutEffect(() => {
    if (!themeObservableContext) return
    if (willChangeTheme) {
      const setClassName = () => {
        if (nodeRef.current) {
          const classNames = themeVariableManager.getClassNames(themeObservableContext.current)
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
    }
    if (hasThemeVariables) {
      if (nodeRef.current) {
        const classNames = themeVariableManager.mountVariables(themeVariables)
        nodeRef.current.className = `display-contents ${classNames}`
        return () => {
          themeVariableManager.unmountVariables(themeVariables)
        }
      }
    }
  }, [theme, hasThemeVariables ? themeVarKeys.map(x => themeVariables[x]) : undefined])

  if (willChangeTheme && hasThemeVariables) {
    console.warn(
      `Warning: You should either change your theme using name/coat/subTheme, or set variables\n
If you'd like to do both, just nest another Theme. For props: `,
      props,
      `Can do this like so:\n
  <Theme name="dark" coat="flat">
    <Theme scale={2}>
      {...}
    </Theme>
  </Theme>`,
    )
    return children as JSX.Element
  }

  if (!themeObservableContext || !(willChangeTheme || hasThemeVariables)) {
    return children as JSX.Element
  }

  if (willChangeTheme) {
    return (
      <CurrentThemeContext.Provider value={themeObservableContext}>
        <div ref={nodeRef} className="display-contents" style={{ display: 'contents' }}>
          {children}
        </div>
      </CurrentThemeContext.Provider>
    )
  }

  if (hasThemeVariables) {
    return (
      <div ref={nodeRef} className="display-contents" style={{ display: 'contents' }}>
        {children}
      </div>
    )
  }

  return null as any
}

const useNextTheme = (props: ThemeChangeProps) => {
  const { name, subTheme, coat } = props
  const themes = useContext(AllThemesContext)
  const curContext = useContext(CurrentThemeContext)
  if (!name && !subTheme && !coat) {
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

function useCreateThemeObservable(theme?: CompiledTheme) {
  const themeObservers = useRef<Set<ThemeObserver>>(new Set())
  const parentContext = useContext(CurrentThemeContext)

  // never change this just emit
  const context: CurrentTheme | null = useMemo(() => {
    return {
      parentContext,
      current: theme ?? parentContext.current,
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
    if (context && theme) {
      if (context.current !== theme) {
        context.current = theme
        themeObservers.current.forEach(cb => {
          theme && cb(theme)
        })
      }
    }
  }, [theme])

  return context
}
