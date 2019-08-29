import { useCurrentComponent } from '@o/automagical'
import { isEqual } from '@o/fast-compare'
import { get } from 'lodash'
import { Lambda, observable, observe, reaction } from 'mobx'
import { useEffect, useLayoutEffect, useRef } from 'react'

import { debugEmit } from './debugUseStore'
import { mobxProxyWorm, ProxyWorm } from './mobxProxyWorm'
import { queueUpdate, removeUpdate } from './queueUpdate'
import { unwrapProxy } from './unwrapProxy'

type TrackableStoreOptions = {
  component: any
  debug?: boolean
  shouldUpdate?: boolean
}

const ProxyWorms = new WeakMap<any, ProxyWorm<StoreLike>>()
if (typeof window !== 'undefined') {
  window['ProxyWorms'] = ProxyWorms
}

type StoreLike = Function & {
  dispose: Function
}

export function setupTrackableStore(
  store: any,
  rerender: Function,
  opts: TrackableStoreOptions = {
    component: {},
  },
) {
  const shouldDebug = (level: number = 1) => {
    if (typeof window !== 'undefined' && window['enableLog'] > level) {
      return true
    }
    // allows per-component debugging using useStoreDebug()
    return opts.debug || (opts.component && opts.component.__debug)
  }
  const name = opts.component.renderName
  const storeName = store.constructor.name
  let paused = true
  const trackedKeysWhilePaused = new Set<string>()
  let reactiveKeys = new Set<string>()
  let deepKeys: string[] = []
  const updateDeepKey = observable.box(0)

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
  // see queueUpdate
  update.__debug_update__ = { name, storeName, action: '', info: null as any }

  const { getters, decorations } = store.__automagic
  const observers: Lambda[] = []

  // this lets us handle deep objects
  const deepKeysObserver = reaction(
    () => {
      updateDeepKey.get()
      if (!deepKeys.length || paused) return 0
      for (const key of deepKeys) get(store, key)
      return Math.random()
    },
    () => {
      if (!deepKeys.length || paused) return
      if (process.env.NODE_ENV === 'development') {
        update.__debug_update__.action = 'deepKeysObserver'
        update.__debug_update__.info = deepKeys
      }
      queueUpdate(update)
    },
  )

  // mobx doesn't like it if we observe a non-decorated store
  // which can happen if a store is only getters
  if (Object.keys(decorations).length > 0) {
    observers.push(
      observe(store, change => {
        const key = change['name']
        if (paused) {
          trackedKeysWhilePaused.add(key)
        } else {
          if (reactiveKeys.has(key)) {
            if (process.env.NODE_ENV === 'development' && shouldDebug()) {
              console.log('update', name, `${storeName}.${key}`, '[undecorated store]')
              update.__debug_update__.action = 'observers'
              update.__debug_update__.info = key
            }
            queueUpdate(update)
          }
        }
      }),
    )
  }

  for (const key in getters) {
    observers.push(
      observe(getters[key], () => {
        if (paused) {
          trackedKeysWhilePaused.add(key)
        } else {
          if (reactiveKeys.has(key)) {
            if (process.env.NODE_ENV === 'development' && shouldDebug()) {
              console.log('update', name, `${storeName}.${key}`, '[getter]')
              update.__debug_update__.action = 'getters'
              update.__debug_update__.info = key
            }
            queueUpdate(update)
          }
        }
      }),
    )
  }

  // this ensures we don't look for a proxied store
  // we want to dedupe on the original store object
  const unwrapped = unwrapProxy(store)

  function getOrCreateProxyWorm(): ProxyWorm<StoreLike> {
    // dedupe stores so we properly track/untrack as we go down to children
    let config = ProxyWorms.get(unwrapped)
    if (!config) {
      config = mobxProxyWorm(store)
      ProxyWorms.set(store, config)
    }
    return config
  }

  const proxyWorm = getOrCreateProxyWorm()

  // done gives us back the keys it tracked
  let done: ReturnType<typeof proxyWorm['track']>
  let disposed = false

  return {
    proxyWorm,
    store: proxyWorm.store,
    track() {
      paused = true
      done = proxyWorm.track(shouldDebug())
    },
    untrack() {
      if (disposed) return
      paused = false
      reactiveKeys = done()
      const nextDeepKeys = [...reactiveKeys].filter(x => x.indexOf('.') > 0)
      // check if anything changed during pause
      if (trackedKeysWhilePaused.size) {
        const shouldUpdate = [...trackedKeysWhilePaused].some(key => reactiveKeys.has(key))
        if (shouldUpdate) {
          if (process.env.NODE_ENV === 'development' && shouldDebug()) {
            console.log('got update while paused', name, storeName, trackedKeysWhilePaused)
            update.__debug_update__.action = 'trackedKeysWhilePaused'
          }
          queueUpdate(update)
        }
        trackedKeysWhilePaused.clear()
      }
      // re-run the reaction that watches keys
      if (!isEqual(nextDeepKeys, deepKeys)) {
        deepKeys = nextDeepKeys
        if (shouldDebug()) console.log('schedule new reaction now...')
        updateDeepKey.set(Math.random())
      }
      if (shouldDebug(4)) {
        console.log('untrack()', name, storeName, reactiveKeys)
      }
    },
    dispose() {
      if (shouldDebug()) console.log('dispose reaction', name, storeName)
      disposed = true
      if (done) done()
      removeUpdate(update)
      deepKeysObserver()
      for (const off of observers) {
        off()
      }
    },
  }
}

export type TrackableStoreObject = ReturnType<typeof setupTrackableStore>

export function useTrackableStore<A>(
  plainStore: A,
  rerenderCb: Function,
  opts?: TrackableStoreOptions,
): TrackableStoreObject {
  const component = useCurrentComponent()
  const trackableStore = useRef<TrackableStoreObject>({} as any)
  let cur = trackableStore.current

  // [HMR] shouldUpdate replaces with new store
  const shouldUpdate = opts && opts.shouldUpdate
  if (cur && cur.store && shouldUpdate) {
    cur.dispose()
  }

  if (plainStore && (!(cur && cur.store) || shouldUpdate)) {
    trackableStore.current = setupTrackableStore(plainStore, rerenderCb, { component, ...opts })
    cur = trackableStore.current
  }

  // dispose on unmount
  useEffect(() => () => cur.dispose && cur.dispose(), [])

  // tracking
  cur.track && cur.track()
  useLayoutEffect(cur.untrack || idFn)

  return cur
}

const idFn = _ => _
