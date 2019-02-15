import { get } from 'lodash'
import { observable, Reaction } from 'mobx'
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
  let rendering = observable.box(false)
  let firstRun = true
  let reactiveKeys = new Set()

  const reaction = new Reaction(`track(${name})`, () => {
    reaction.track(() => {
      if (rendering.get()) return
      if (reactiveKeys.size === 0) return
      for (const key of [...reactiveKeys]) {
        get(store, key)
      }
      if (firstRun) {
        firstRun = false
        return
      }
      if (options.component && process.env.NODE_ENV === 'development') {
        if (options.component.__debug) {
          console.log('useStore forceUpdate', name, reactiveKeys)
        }
        debugEmit({
          type: 'render',
          component: options.component,
          componentName: name,
          reactiveKeys,
        })
      }
      rerender()
    })
  })

  reaction.schedule()

  const config = DedupedWorms.get(store) || mobxProxyWorm(store)
  DedupedWorms.set(store, config)
  let done: ReturnType<typeof config['track']> = null

  return {
    store: config.store,
    track() {
      done = config.track(name === 'OrbitPageInner' ? 20 : Math.random())
      rendering.set(true)
    },
    untrack() {
      firstRun = true
      reactiveKeys = done()
      rendering.set(false)
    },
    dispose: reaction.getDisposer(),
    reactiveKeys,
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
    reactiveKeys: null,
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
