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
  let value = null
  let firstRun = true

  const reaction = new Reaction(`track(${component.displayName})`, () => {
    let changed = false
    console.log('reaction', component.displayName, reactiveKeys)

    reaction.track(() => {
      if (rendering) return
      if (reactiveKeys.size === 0) return
      const nextValue = [...reactiveKeys].map(k => store[k])
      changed = !firstRun && !isEqual(nextValue, value)
      console.log('changed', changed, component.displayName, reactiveKeys)
      value = nextValue
      firstRun = false
    })

    if (changed) rerender()
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
      console.log('track', component.displayName)
      value = null
      reactiveKeys.clear()
      rendering = true
    },
    untrack() {
      rendering = false
      firstRun = true
      reaction.schedule()

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
    dispose: () => {
      console.log('disposing', component.displayName)
      reaction.dispose()
    },
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
