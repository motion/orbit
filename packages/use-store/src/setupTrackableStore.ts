import { observe } from 'mobx'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { debugEmit } from './debugUseStore'
import { mobxProxyWorm } from './mobxProxyWorm'
import { getCurrentComponent } from './useStore'

type TrackableStoreOptions = {
  component: any
  debug?: boolean
}

const DedupedWorms = new WeakMap<any, ReturnType<typeof mobxProxyWorm>>()

export function setupTrackableStore(
  store: any,
  rerender: Function,
  opts: TrackableStoreOptions = { component: {} },
) {
  const debug = opts.debug || (opts.component && opts.component.__debug)
  const name = opts.component.renderName
  const storeName = store.constructor.name
  let flushing = false
  let paused = true
  let reactiveKeys = new Set()

  const flush = () => {
    flushing = true
    if (paused) return
    if (process.env.NODE_ENV === 'development') {
      if (opts.component) {
        debugEmit({
          type: 'render',
          component: opts.component,
          reactiveKeys,
          store,
        })
      }
    }
    rerender()
    setImmediate(() => {
      flushing = false
    })
  }
  const { getters, decorations } = store.__automagic

  const observers = []

  // mobx doesn't like it if we observe a non-decorated store
  // which can happen if a store is only getters
  if (Object.keys(decorations).length > 0) {
    observe(store, change => {
      if (flushing) return
      const key = change['name']
      if (reactiveKeys.has(key)) {
        if (debug) console.log('update', name, 'from', `${storeName}.${key}`)
        flush()
      }
    })
  }

  for (const key in getters) {
    observers.push(
      observe(getters[key], () => {
        if (reactiveKeys.has(key)) {
          if (flushing) return
          if (debug) console.log('update', name, 'from', `${storeName}.${key}`, '[get]')
          flush()
        }
      }),
    )
  }

  const config = DedupedWorms.get(store) || mobxProxyWorm(store)
  DedupedWorms.set(store, config)
  let done: ReturnType<typeof config['track']> = null

  return {
    store: config.store,
    track() {
      paused = true
      done = config.track(Math.random(), opts.debug || false)
    },
    untrack() {
      reactiveKeys = done()
      paused = false
    },
    dispose() {
      for (const observer of observers) {
        observer()
      }
    },
  }
}

export function useTrackableStore<A>(
  plainStore: A,
  rerenderCb: Function,
  opts?: TrackableStoreOptions,
): A {
  const component = getCurrentComponent()
  const trackableStore = useRef({
    store: null,
    track: null,
    untrack: null,
    dispose: null,
  })
  if (!trackableStore.current.store) {
    trackableStore.current = setupTrackableStore(plainStore, rerenderCb, { component, ...opts })
  }
  useEffect(() => {
    return () => {
      const bye = trackableStore.current.dispose
      if (bye) bye()
    }
  }, [])
  const { store, track, untrack } = trackableStore.current
  track()
  useLayoutEffect(untrack)
  return store
}
