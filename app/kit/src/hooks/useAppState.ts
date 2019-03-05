import { Bit } from '@mcro/models'
import { useStores } from './useStores'

// we are simplifying the appStore state here
// so that users can reference a type rather than a whole store

type HistoryItem = {
  bit?: Bit
  state?: any
}

type AppState = {
  history: HistoryItem[]
  back: () => void
  forward: () => void
  selectedIndex?: number
  getCurrentItems?: () => Bit[]
  activeQuery?: string
}

export function useAppState(): AppState {
  const { appStore } = useStores()
  return appStore
}
