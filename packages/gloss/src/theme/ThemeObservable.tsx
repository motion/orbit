import { createContext, useEffect, useMemo, useRef } from 'react'

import { CompiledTheme } from './createTheme'

export type ThemeObserver = (theme: CompiledTheme) => any
type ThemeObservable = (onChange: ThemeObserver) => { unsubscribe: () => void }
export type ThemeObservableType = {
  subscribe: ThemeObservable
  current: CompiledTheme
}

export const ThemeObservable = createContext<ThemeObservableType>({
  subscribe: _ => ({ unsubscribe: () => {} }),
  current: null as any,
})

export function useProvideThemeObservable(props: { theme: CompiledTheme }) {
  const themeObservers = useRef<Set<ThemeObserver>>(new Set())

  // never change this just emit
  const themeObservableContext: ThemeObservableType = useMemo(() => {
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
    if (themeObservableContext.current !== props.theme) {
      themeObservableContext.current = props.theme
      themeObservers.current.forEach(cb => {
        cb(props.theme)
      })
    }
  }, [props.theme])

  return themeObservableContext
}
