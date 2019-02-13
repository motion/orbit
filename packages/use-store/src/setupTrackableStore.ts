import { observe } from 'mobx'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { debugEmit } from './debugUseStore'
import { getCurrentComponent } from './useStore'

export function setupTrackableStore(
  store: any,
  rerender: Function,
  component?: any,
  componentId?: number,
) {
  if (component.displayName === 'OrbitNav') {
    debugger
  }
  const reactiveKeys = new Set()
  let rendering = false
  let dispose = null
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
      reactiveKeys.clear()
      rendering = true
      if (!dispose) {
        try {
          dispose = observe(store, change => {
            if (component.displayName === 'OrbitNav') {
              console.log(
                'OrbitNav.observe',
                change['name'],
                store,
                change.object,
                rendering,
                reactiveKeys,
              )
            }
            if (rendering) return
            if (!reactiveKeys.size) return
            if (!reactiveKeys.has(change['name'])) return
            if (process.env.NODE_ENV === 'development') {
              debugEmit({
                type: 'observe',
                key: change['name'],
                store,
                oldValue: change.oldValue,
                newValue: change.newValue,
                component,
                componentId,
              })
            }
            rerender()
          })
        } catch (err) {
          console.error(err)
        }
      }
    },
    untrack() {
      rendering = false
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
    dispose: () => dispose && dispose(),
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
