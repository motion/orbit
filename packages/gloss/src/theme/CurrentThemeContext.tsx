import { createContext, useEffect, useMemo, useRef } from 'react'

import { CompiledTheme } from './createTheme'

export type ThemeObserver = (theme: CompiledTheme) => any
type ThemeObservable = (onChange: ThemeObserver) => { unsubscribe: () => void }
export type CurrentTheme = {
  subscribe: ThemeObservable
  current: CompiledTheme
}

export const CurrentThemeContext = createContext<CurrentTheme>({
  subscribe: _ => ({ unsubscribe: () => {} }),
  current: null as any,
})

export function useProvideCurrentTheme(props: { theme: CompiledTheme }) {
  const themeObservers = useRef<Set<ThemeObserver>>(new Set())

  // never change this just emit
  const context: CurrentTheme = useMemo(() => {
    return {
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

  useEffect(() => {
    if (context.current !== props.theme) {
      context.current = props.theme
      themeObservers.current.forEach(cb => {
        cb(props.theme)
      })
    }
  }, [props.theme])

  return context
}
