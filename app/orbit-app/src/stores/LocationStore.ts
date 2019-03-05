import { useReaction } from '@mcro/use-store'
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

export function parseUrl(url: string): URLState {
  const basenameMatch = url.match(/(app:\/\/)?([a-z]+)[\/\?]?/i)
  const basename = basenameMatch && basenameMatch.length == 3 ? basenameMatch[2] : ''
  if (!basename) {
    throw new Error(`No match ${url}`)
  }
  const queryMatch = url.match(/\?.*/)
  const query =
    (queryMatch &&
      queryMatch[0]
        .slice(1)
        .split('&')
        .map(query => {
          const [key, value] = query.split('=')
          return { key, value }
        })) ||
    []
  return {
    basename,
    query,
    at: Date.now(),
  }
}

export function useLocationEffect(fn: (url: URLState) => void) {
  const { locationStore } = useStoresSimple()
  useReaction(() => locationStore.current, fn)
}

export function useLocationLink(url: string, stopPropagation = false) {
  const { locationStore } = useStoresSimple()
  return (e: React.MouseEvent<any, any> | MouseEvent) => {
    if (stopPropagation) {
      e.stopPropagation()
      e.preventDefault()
    }
    console.log('Clicking link', url)
    locationStore.push(parseUrl(url))
  }
}
