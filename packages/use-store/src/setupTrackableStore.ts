import { useCurrentComponent } from '@mcro/automagical'
import { isEqual } from '@mcro/fast-compare'
import { get } from 'lodash'
import { observe, Reaction, transaction } from 'mobx'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { debugEmit } from './debugUseStore'
import { GET_STORE, mobxProxyWorm } from './mobxProxyWorm'
import { queueUpdate, removeUpdate } from './queueUpdate'

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
  const debug = () => {
    if (typeof window !== 'undefined' && window['enableLog'] > 1) {
      return true
    }
    return opts.debug || (opts.component && opts.component.__debug)
  }
  const name = `)) ${opts.component.renderName}`
  const storeName = store.constructor.name
  let paused = true
  let reactiveKeys = new Set()
  let deepKeys = []

  const update = () => {
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
  }

  const { getters, decorations } = store.__automagic
  const observers = []

  // this lets us handle deep objects
  const reaction = new Reaction(`track(${name})`, () => {
    if (paused) return
    reaction.track(() => {
      if (deepKeys.length) {
        transaction(() => {
          if (debug()) console.log('update', name, storeName, deepKeys, '[reactive key]')
          deepKeys.forEach(key => {
            get(store, key)
          })
        })
        queueUpdate(update)
      }
    })
  })

  // mobx doesn't like it if we observe a non-decorated store
  // which can happen if a store is only getters
  if (Object.keys(decorations).length > 0) {
    observers.push(
      observe(store, change => {
        const key = change['name']
        if (reactiveKeys.has(key)) {
          if (debug()) console.log('update', name, `${storeName}.${key}`, '[undecorated store]')
          queueUpdate(update)
        }
      }),
    )
  }

  for (const key in getters) {
    observers.push(
      observe(getters[key], () => {
        if (reactiveKeys.has(key)) {
          if (debug()) console.log('update', name, `${storeName}.${key}`, '[getter]')
          queueUpdate(update)
        }
      }),
    )
  }

  // this ensures we don't look for a proxied store
  // we want to dedupe on the original store object
  const unwrapped = store[GET_STORE] || store

  // dedupe stores so we properly track/untrack as we go down to children
  let config = DedupedWorms.get(unwrapped)
  if (!config) {
    config = mobxProxyWorm(store)
    DedupedWorms.set(store, config)
  }

  // done gives us back the keys it tracked
  let done: ReturnType<typeof config['track']> = null

  return {
    store: config.store,
    track() {
      paused = true
      const id = Math.random()
      if (debug()) console.log('track()  ', id, name, storeName, config.state)
      done = config.track(id, debug())
    },
    untrack() {
      paused = false
      reactiveKeys = done()
      const nextDeepKeys = [...reactiveKeys].filter(x => x.indexOf('.') > 0)
      if (!isEqual(nextDeepKeys, deepKeys)) {
        deepKeys = nextDeepKeys
        reaction.schedule()
      }
      if (debug()) {
        console.log('untrack()', name, storeName, reactiveKeys, deepKeys, '[reactive/deep keys]')
      }
    },
    dispose() {
      done()
      removeUpdate(update)
      reaction.dispose()
      for (const off of observers) {
        off()
      }
    },
  }
}

export function useTrackableStore<A>(
  plainStore: A,
  rerenderCb: Function,
  opts?: TrackableStoreOptions,
): A {
  const component = useCurrentComponent()
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
      const { dispose } = trackableStore.current
      dispose()
    }
  }, [])
  const { store, track, untrack } = trackableStore.current
  track()
  useLayoutEffect(untrack)
  return store
}
