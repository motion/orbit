import { createContext, useEffect, useMemo, useRef } from 'react'

import { ThemeContextType } from './ThemeContext'

export type ThemeObserver = (theme: ThemeContextType) => any
type ThemeObservable = (onChange: ThemeObserver) => { unsubscribe: () => void }
export type ThemeObservableType = {
  subscribe: ThemeObservable
  current: ThemeContextType
}

export const ThemeObservable = createContext<ThemeObservableType>({
  subscribe: _ => ({ unsubscribe: () => {} }),
  current: null as any,
})

export function useProvideThemeObservable(props: { themeContext: ThemeContextType }) {
  const themeObservers = useRef<Set<ThemeObserver>>(new Set())

  // never change this just emit
  const themeObservableContext: ThemeObservableType = useMemo(() => {
    return {
      current: props.themeContext,
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
    if (themeObservableContext.current !== props.themeContext) {
      themeObservableContext.current = props.themeContext
      themeObservers.current.forEach(cb => {
        cb(props.themeContext)
      })
    }
  }, [props.themeContext])

  return themeObservableContext
}
