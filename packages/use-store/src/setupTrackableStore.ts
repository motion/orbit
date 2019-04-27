import { useCurrentComponent } from '@o/automagical'
import { isEqual } from '@o/fast-compare'
import { get } from 'lodash'
import { Lambda, observe, Reaction, transaction } from 'mobx'
import { useEffect, useLayoutEffect, useRef } from 'react'

import { debugEmit } from './debugUseStore'
import { mobxProxyWorm, ProxyWorm } from './mobxProxyWorm'
import { queueUpdate, removeUpdate } from './queueUpdate'
import { unwrapProxy } from './useStore'

type TrackableStoreOptions = {
  component: any
  debug?: boolean
  shouldUpdate?: boolean
}

const DedupedWorms = new WeakMap<any, ProxyWorm<StoreLike>>()

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
  const debug = () => {
    if (typeof window !== 'undefined' && window['enableLog'] > 1) {
      return true
    }
    return opts.debug || (opts.component && opts.component.__debug)
  }
  const name = opts.component.renderName
  const storeName = store.constructor.name
  let paused = true
  let reactiveKeys = new Set<string>()
  let deepKeys: string[] = []

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
  const observers: Lambda[] = []

  // this lets us handle deep objects
  const reaction = new Reaction(`track(${name})`, () => {
    reaction.track(() => {
      if (paused) return
      if (!deepKeys.length) return
      transaction(() => {
        deepKeys.forEach(key => {
          get(store, key)
        })
      })
      if (debug()) console.log('update', name, storeName, deepKeys, '[deepKeys]')
      queueUpdate(update)
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
  const unwrapped = unwrapProxy(store)

  function getOrCreateProxyWorm(): ProxyWorm<StoreLike> {
    // dedupe stores so we properly track/untrack as we go down to children
    let config = DedupedWorms.get(unwrapped)
    if (!config) {
      config = mobxProxyWorm(store)
      DedupedWorms.set(store, config)
    }
    return config
  }

  const config = getOrCreateProxyWorm()

  // done gives us back the keys it tracked
  let done: ReturnType<typeof config['track']>
  let disposed = false

  return {
    store: config.store,
    track() {
      paused = true
      done = config.track(debug())
    },
    untrack() {
      if (disposed) return
      paused = false
      reactiveKeys = done()
      const nextDeepKeys = [...reactiveKeys].filter(x => x.indexOf('.') > 0)
      if (!isEqual(nextDeepKeys, deepKeys)) {
        deepKeys = nextDeepKeys
        reaction.schedule()
        if (debug()) console.log('schedule reaction')
      }
      if (debug()) {
        console.log('untrack()', name, storeName, reactiveKeys, deepKeys, '[reactive/deep]')
      }
    },
    dispose() {
      if (debug()) console.log('dispose reaction', name, storeName)
      disposed = true
      if (done) done()
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
  const trackableStore = useRef<ReturnType<typeof setupTrackableStore>>({} as any)
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

  return cur.store as any
}

const idFn = _ => _
