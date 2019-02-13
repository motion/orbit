import { Reaction } from 'mobx'
import { useEffect, useLayoutEffect, useRef } from 'react'
import isEqual from 'react-fast-compare'
import { debugEmit } from './debugUseStore'
import { getCurrentComponent } from './useStore'

export function setupTrackableStore(
  store: any,
  rerender: Function,
  component?: any,
  componentId?: number,
) {
  const reactiveKeys = new Set()
  let rendering = false
  let changed = false
  let value = null

  const reaction = new Reaction(`track(${component.displayName})`, () => {
    console.log('render', component.displayName, rendering, changed)
    if (rendering) return
    if (changed) {
      rerender()
      changed = false
    }
  })

  return {
    store: new Proxy(store as any, {
      get(target, key) {
        if (rendering && typeof key === 'string') {
          reactiveKeys.add(key)
        }
        return Reflect.get(target, key)
      },
    }),
    track() {
      value = null
      reactiveKeys.clear()
      rendering = true
    },
    untrack() {
      if (reactiveKeys.size) {
        reaction.track(() => {
          console.log('tracking', component.displayName, reactiveKeys)
          const nextValue = [...reactiveKeys].map(k => store[k])
          changed = !!value && !isEqual(nextValue, value)
          value = nextValue
          rendering = false
        })
      }

      if (process.env.NODE_ENV === 'development') {
        debugEmit({
          type: 'reactiveKeys',
          keys: reactiveKeys,
          component,
          store,
          componentId,
        })
      }
    },
    dispose: () => reaction.dispose(),
    reactiveKeys,
  }
}

export function useTrackableStore<A>(plainStore: A, rerenderCb: Function, componentId?: number): A {
  const component = getCurrentComponent()
  const trackableStore = useRef({
    store: null,
    track: null,
    untrack: null,
    dispose: null,
    reactiveKeys: null,
  })
  if (!trackableStore.current.store) {
    trackableStore.current = setupTrackableStore(plainStore, rerenderCb, component, componentId)
  }
  useEffect(() => {
    return () => {
      const bye = trackableStore.current.dispose
      if (bye) {
        bye()
      }
    }
  }, [])
  const { store, track, untrack } = trackableStore.current
  track()
  useLayoutEffect(untrack)
  return store
}
