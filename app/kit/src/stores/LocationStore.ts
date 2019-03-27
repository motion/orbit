import { isEqual } from '@o/fast-compare'
import { useReaction } from '@o/use-store'
import { fromEntries } from '@o/utils'
import { useStoresSimple } from '../hooks/useStores'

type URLSource = 'link' | 'internal'

type URLState = {
  basename: string
  query: { [key: string]: string }
  at: number
  source: URLSource
}

export class LocationStore {
  history: URLState[] = []

  get url() {
    return this.history[this.history.length - 1] || null
  }

  get urlString() {
    if (!this.url) {
      return ''
    }
    let res = `app://${this.url.basename}`
    const queries = Object.entries(this.url.query)
    if (queries.length) {
      res = `${res}/?${queries.map(([k, v]) => `${k}=${v}`).join('')}`
    }
    return res
  }

  go = (url: URLState) => {
    if (isEqual(url, this.url)) {
      console.warn('already on url...')
      return
    }
    this.history = [...this.history, url].slice(0, 500)
  }

  back = () => {
    this.history = this.history.slice(0, this.history.length - 1)
  }
}

export function parseUrl(url: string, source: URLSource): URLState {
  const basenameMatch = url.match(/(app:\/\/)?([a-z]+)[\/\?]?/i)
  const basename = basenameMatch && basenameMatch.length == 3 ? basenameMatch[2] : ''
  if (!basename) {
    throw new Error(`No match ${url}`)
  }
  const queryMatch = url.match(/\?.*/)
  const query =
    (queryMatch &&
      fromEntries(
        queryMatch[0]
          .slice(1)
          .split('&')
          .map(query => query.split('=')),
      )) ||
    {}
  return {
    basename,
    query,
    at: Date.now(),
    source,
  }
}

export function useLocationEffect(fn: (url: URLState) => void) {
  const { locationStore } = useStoresSimple()
  useReaction(() => locationStore.url, fn)
}

export function useLocationLink(url: string | false, stopPropagation = false) {
  const { locationStore } = useStoresSimple()
  if (!url) {
    return null
  }
  return (e: React.MouseEvent<any, any> | MouseEvent) => {
    if (stopPropagation) {
      e.stopPropagation()
      e.preventDefault()
    }
    locationStore.go(parseUrl(url, 'link'))
  }
}
