import { isEqual } from '@o/fast-compare'
import { useReaction } from '@o/use-store'
import { fromEntries } from '@o/utils'
import { Derive } from 'overmind'

import { useStoresSimple } from '../hooks/useStores'

type State = {
  history: URLState[]
  url: Derive<State, URLState>
  urlString: Derive<State, string>
}

type URLSource = 'link' | 'internal'

type URLState = {
  basename: string
  query: { [key: string]: string }
  at: number
  source: URLSource
}

export const state: State = {
  history: [],
  url(state) {
    return state.history[state.history.length - 1] || null
  },
  urlString(state) {
    if (!this.url) {
      return ''
    }
    let res = `app://${state.url.basename}`
    const queries = Object.entries(state.url.query)
    if (queries.length) {
      res = `${res}/?${queries.map(([k, v]) => `${k}=${v}`).join('')}`
    }
    return res
  },
}

export const actions = {
  go({ state }, { url }) {
    if (isEqual(url, state.url)) {
      console.warn('already on url...')
      return
    }
    state.history = [...state.history, url].slice(0, 500)
  },
  back({ state }) {
    state.history = state.history.slice(0, state.history.length - 1)
  },
}

export function parseUrl(url: string, source: URLSource): URLState {
  const basenameMatch = url.match(/(app:\/\/)?([a-z-0-9]+)[\/\?]?/i)
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
          .map(q => q.split('=')),
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
  return (e?: React.MouseEvent<any, any> | MouseEvent) => {
    if (e && stopPropagation) {
      e.stopPropagation()
      e.preventDefault()
    }
    locationStore.go(parseUrl(url, 'link'))
  }
}
