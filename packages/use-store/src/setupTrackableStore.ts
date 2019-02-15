import { get, isEqual } from 'lodash'
import { Reaction } from 'mobx'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { debugEmit } from './debugUseStore'
import { mobxProxyWorm } from './mobxProxyWorm'
import { getCurrentComponent } from './useStore'

type TrackableStoreOptions = {
  componentId?: number
  component: any
  debug?: boolean
}

const DedupedWorms = new WeakMap<any, ReturnType<typeof mobxProxyWorm>>()

export function setupTrackableStore(
  store: any,
  rerender: Function,
  options?: TrackableStoreOptions,
) {
  const name = options && options.component.renderName
  let paused = true
  let reactiveKeys = new Set()
  let tm = null

  const rerenderOnce = () => {
    if (options.component && process.env.NODE_ENV === 'development') {
      debugEmit({
        type: 'render',
        component: options.component,
        reactiveKeys,
        store,
      })
    }
    rerender()
  }

  const reaction = new Reaction(`track(${name})`, () => {
    if (paused) return
    reaction.track(() => {
      if (reactiveKeys.size === 0) return
      for (const key of [...reactiveKeys]) {
        get(store, key)
      }
      clearImmediate(tm)
      setImmediate(rerenderOnce)
    })
  })

  const config = DedupedWorms.get(store) || mobxProxyWorm(store)
  DedupedWorms.set(store, config)
  let done: ReturnType<typeof config['track']> = null

  return {
    store: config.store,
    track() {
      clearImmediate(tm)
      paused = true
      done = config.track(Math.random())
    },
    untrack() {
      let nextKeys = done()
      paused = false
      if (!isEqual(nextKeys, reactiveKeys)) {
        reactiveKeys = nextKeys
        store['__useStoreKeys'] = nextKeys
        reaction.schedule()
      }
    },
    dispose() {
      clearImmediate(tm)
      reaction.dispose()
    },
  }
}

export function useTrackableStore<A>(
  plainStore: A,
  rerenderCb: Function,
  options?: TrackableStoreOptions,
): A {
  const component = getCurrentComponent()
  const trackableStore = useRef({
    store: null,
    track: null,
    untrack: null,
    dispose: null,
  })
  if (!trackableStore.current.store) {
    trackableStore.current = setupTrackableStore(plainStore, rerenderCb, { component, ...options })
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
