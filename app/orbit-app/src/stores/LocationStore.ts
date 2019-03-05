import { useReaction } from '@mcro/black'
import { useStoresSimple } from '../hooks/useStores'

type Query = {
  key: string
  value: string
}

type URLState = {
  basename: string
  query: Query[]
  at: number
}

export class LocationStore {
  history: URLState[] = []

  get current() {
    return this.history[this.history.length - 1]
  }

  push = (url: URLState) => {
    this.history = [...this.history, url]
  }

  back = () => {
    this.history = this.history.slice(0, this.history.length - 1)
  }
}

export function useLocationEffect(fn: (url: URLState) => void) {
  const { locationStore } = useStoresSimple()
  useReaction(() => locationStore.current, fn)
}
