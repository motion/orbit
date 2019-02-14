import { observable, Reaction } from 'mobx'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { getCurrentComponent } from './useStore'

type TrackableStoreOptions = {
  componentId?: number
  component: any
  debug?: boolean
}

export function setupTrackableStore(
  store: any,
  rerender: Function,
  options?: TrackableStoreOptions,
) {
  const name = options && options.component.displayName
  const reactiveKeys = new Set()
  let rendering = observable.box(false)
  let firstRun = true

  const reaction = new Reaction(`track(${name})`, () => {
    reaction.track(() => {
      if (rendering.get()) return
      if (reactiveKeys.size === 0) return
      for (const key of [...reactiveKeys]) {
        store[key]
      }
      if (firstRun) {
        firstRun = false
        return
      }
      rerender()
    })
  })

  reaction.schedule()

  return {
    store: new Proxy(store, {
      get(target, key) {
        if (rendering && typeof key === 'string') {
          reactiveKeys.add(key)
        }
        return Reflect.get(target, key)
      },
    }),
    track() {
      reactiveKeys.clear()
      rendering.set(true)
    },
    untrack() {
      firstRun = true
      rendering.set(false)

      // TODO only emit if its changed
      // if (process.env.NODE_ENV === 'development') {
      //   debugEmit(
      //     {
      //       type: 'reactiveKeys',
      //       keys: reactiveKeys,
      //       component: options.component,
      //       store,
      //       componentId: options.componentId,
      //     },
      //     options,
      //   )
      // }
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
