import { decorate, useForceUpdate } from '@o/use-store'
import { MotionValue, useSpring, useTransform } from 'framer-motion'
import { SpringProps } from 'popmotion'
import React from 'react'
import { isValidElement, memo, RefObject, useContext, useEffect, useLayoutEffect, useRef } from 'react'

import { useLazyRef } from './hooks/useLazyRef'
import { useNodeSize } from './hooks/useNodeSize'
import { useOnHotReload } from './hooks/useOnHotReload'
import { useRelative } from './hooks/useRelative'
import { useScrollProgress } from './hooks/useScrollProgress'
import { ScrollableRefContext } from './View/ScrollableRefContext'

// @ts-ignore
@decorate
class HooksStore<T> {
  hooksKey = 0
  hooks: ((lastHooks: T[]) => T)[] = []
  addHook(next: (lastHooks: T[]) => T) {
    this.hooks = [...this.hooks, next]
    this.hooksKey = Math.random()
  }
}

export class AnimationStore {
  animationHooks = new HooksStore<MotionValue>()
  frozen = false
  values = []

  freeze() {
    this.frozen = true
  }

  getValue() {
    return this.values[this.values.length - 1]
  }

  transform<T>(transform: (v: any) => T): AnimationStore
  transform(from: number[], to?: any[], options?: any): AnimationStore
  transform(from: any, to?: any[], options?: any): AnimationStore {
    if (this.frozen) return this
    this.animationHooks.addHook(hooksValues => {
      const lastHookVal = hooksValues[hooksValues.length - 1]
      return useTransform(lastHookVal, from, to, options as any)
    })
    return this
  }

  spring(props: SpringProps) {
    if (this.frozen) return this
    this.animationHooks.addHook(hooksValues => {
      const lastHookVal = hooksValues[hooksValues.length - 1]
      return useSpring(lastHookVal, props)
    })
    return this
  }

  mergeTransform<T>(values: MotionValue<T>[], callback: (previous: T, ...values: T[]) => T) {
    if (this.frozen) return this
    this.animationHooks.addHook(hooksValues => {
      const lastHookVal = hooksValues[hooksValues.length - 1]
      return useRelative(callback, lastHookVal, ...values)
    })
    return this
  }
}

class GeometryStore {
  stores: AnimationStore[] = []
  curCall = 0
  frozen = false

  constructor(private nodeRef: RefObject<HTMLElement>) {}

  onRender() {
    this.curCall = 0
  }

  clear() {
    this.stores = []
    this.curCall = 0
    this.frozen = false
  }

  freeze() {
    this.frozen = true
  }

  setupStore(fn: (store: AnimationStore) => void) {
    const curStore = this.stores[this.curCall]
    this.curCall++
    if (curStore) {
      return curStore
    }
    if (this.frozen) {
      throw new Error(`Error, using Geometry strangely`)
    }
    const store = new AnimationStore()
    fn(store)
    this.stores = [...this.stores, store]
    return store
  }

  /**
   * Returns a 0 to 1 value (for any child) representing the current scroll position of the parent scrollable
   */
  scrollProgress() {
    return this.setupStore(store => {
      store.animationHooks.addHook(() => {
        const ref = useContext(ScrollableRefContext)
        return useScrollProgress({
          ref,
        })
      })
    })
  }

  sharedScrollProgress = null

  /**
   * Returns -1 to 1 value of the current nodes intersection within the parent scrollable
   * (where -1 is off on the left/top, and 1 is off on the right/bottom, 0 is centered)
   */
  scrollIntersection() {
    return this.setupStore(store => {
      const { sharedScrollProgress } = this
      store.animationHooks.addHook(() => {
        const ref = useContext(ScrollableRefContext)
        const scrollProgress = (() => {
          if (sharedScrollProgress) return sharedScrollProgress
          return useScrollProgress({
            ref,
          })
        })()

        // needs to be mounted to be effective
        const state = useRef({
          offset: 0,
          width: 0.1,
        })
        // doing this onMount failed with ref.current.scrollWidth being empty if suspense threw
        useNodeSize({
          throttle: 100,
          ref,
          onChange: () => {
            if (!this.nodeRef.current || !ref.current) {
              throw new Error(`No node or parent node (did you give a parent scrollable=""?)`)
            }
            if (!ref.current.scrollWidth) {
              return
            }
            const total = ref.current.childElementCount
            const nodeWidth = this.nodeRef.current.clientWidth
            const nodeLeft = this.nodeRef.current.offsetLeft
            const parentWidth = ref.current.scrollWidth
            const offset = nodeLeft / (parentWidth - nodeWidth)
            state.current.offset = offset
            // assume all have same widths for now
            state.current.width = 1 / (total - 1)
            // trigger update
            scrollProgress.set(scrollProgress.get())
          },
        })

        // this should make it go to 0 once node is centered
        return useTransform(scrollProgress, x => {
          return (x - state.current.offset) / state.current.width
        })
      })
    })
  }
}

export function Geometry(props: {
  children: (geometry: GeometryStore, ref: any) => React.ReactNode
}) {
  const nodeRef = useRef()
  const geometry = useLazyRef(() => new GeometryStore(nodeRef)).current
  const update = useForceUpdate()

  useOnHotReload(() => {
    geometry.clear()
    update()
  })

  geometry.onRender()
  const childrenElements = props.children(geometry, nodeRef)

  for (const store of geometry.stores) {
    const hooks = []
    for (const hook of store.animationHooks.hooks) {
      hooks.push(hook(hooks))
    }
    store.values = hooks
    store.freeze()
  }
  geometry.freeze()

  return <>{childrenElements}</>
}
