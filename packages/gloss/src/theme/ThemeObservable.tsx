import { createContext } from 'react'

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
