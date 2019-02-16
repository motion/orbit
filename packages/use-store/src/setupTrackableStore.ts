import { get, isEqual } from 'lodash'
import { Reaction, transaction } from 'mobx'
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
  options?: TrackableStoreOptions,
) {
  const name = options && options.component.renderName
  let paused = true
  let reactiveKeys = new Set()

  const update = () => {
    if (process.env.NODE_ENV === 'development') {
      if (options && options.component) {
        debugEmit({
          type: 'render',
          component: options.component,
          reactiveKeys,
          store,
        })
      }
    }
    rerender()
  }

  const reaction = new Reaction(`track(${name})`, () => {
    if (paused) return
    reaction.track(() => {
      if (reactiveKeys.size === 0) return
      transaction(() => {
        for (const key of [...reactiveKeys]) {
          get(store, key)
        }
      })
      update()
    })
  })

  const config = DedupedWorms.get(store) || mobxProxyWorm(store)
  DedupedWorms.set(store, config)
  let done: ReturnType<typeof config['track']> = null

  return {
    store: config.store,
    track() {
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
