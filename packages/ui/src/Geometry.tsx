import { decorate, useForceUpdate } from '@o/use-store'
import { MotionValue, useSpring, useTransform, useViewportScroll } from 'framer-motion'
import { SpringProps } from 'popmotion'
import React from 'react'
import { RefObject, useCallback, useContext, useEffect, useRef } from 'react'

import { useLazyRef } from './hooks/useLazyRef'
import { useOnHotReload } from './hooks/useOnHotReload'
import { useRelative } from './hooks/useRelative'
import { useScrollProgress } from './hooks/useScrollProgress'
import { useScrollableParent } from './View/ScrollableParentStore'

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

export class GeometryStore<A = any> {
  stores: AnimationStore[] = []
  curCall = 0
  frozen = false

  constructor(private nodeRef: RefObject<HTMLElement>, public props: A) {}

  beforeRenderChildren() {
    this.curCall = 0
  }

  afterRenderChildren() {
    for (const store of this.stores) {
      const hooks = []
      for (const hook of store.animationHooks.hooks) {
        hooks.push(hook(hooks))
      }
      store.values = hooks
      store.freeze()
    }
    this.freeze()
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
   * Viewport scroll
   */
  useViewportScroll(key: 'x' | 'y' | 'xProgress' | 'yProgress') {
    return this.setupStore(store => {
      store.animationHooks.addHook(() => {
        return useViewportScroll()[`scroll${key[0].toUpperCase()}${key.slice(1)}`]
      })
    })
  }

  /**
   * Use an existing MotionValue and transform it
   */
  useTransform<T>(value: MotionValue<T>, transform?: (val: T) => T) {
    return this.setupStore(store => {
      store.animationHooks.addHook(() => {
        return useTransform(value, transform)
      })
    })
  }

  /**
   * Returns a 0 to 1 value (for any child) representing the current scroll position of the parent scrollable
   */
  scrollProgress() {
    return this.setupStore(store => {
      store.animationHooks.addHook(() => {
        const scrollableParent = useScrollableParent()
        return useScrollProgress({
          ref: scrollableParent.props.ref,
        })
      })
    })
  }

  /**
   * Returns -1 to 1 value of the current nodes intersection within the parent scrollable
   * (where -1 is off on the left/top, and 1 is off on the right/bottom, 0 is centered)
   */
  scrollIntersection() {
    return this.setupStore(store => {
      store.animationHooks.addHook(() => {
        const scrollableParentStore = useScrollableParent()
        if (!scrollableParentStore) {
          throw new Error(
            'No scrollable parent, must have a view like <Col scrollable={} /> as parent',
          )
        }
        const { scrollIntersectionState } = scrollableParentStore

        useEffect(() => {
          scrollableParentStore.startIntersection()
        }, [])

        // this should make it go to 0 once node is centered
        return useTransform(scrollIntersectionState.scrollProgress, scroll => {
          if (!scrollIntersectionState.ready) {
            return 0
          }
          const index = scrollIntersectionState.elements.indexOf(this.nodeRef.current)
          const state = scrollIntersectionState.measurements.get(index)
          const res = state ? (state.offset - scroll) * state.total : 0
          return res
        })
      })
    })
  }
}

export type GeometryRenderer<A extends GeometryStore> = (
  geometry: A,
  ref: RefObject<HTMLElement>,
) => React.ReactNode

export function useGeometry<A extends GeometryStore>(
  getChildren: GeometryRenderer<A>,
  GeometryConstructor: { new (...args: any): A },
  geometryProps?: any,
) {
  const ref = useRef()
  const geometry = useLazyRef(() => new GeometryConstructor(ref, geometryProps)).current
  const update = useForceUpdate()

  useOnHotReload(() => {
    geometry.clear()
    update()
  })

  geometry.beforeRenderChildren()
  const children = getChildren(geometry, ref)
  geometry.afterRenderChildren()
  return children as JSX.Element
}

export function Geometry(props: { children: GeometryRenderer<GeometryStore> }) {
  return useGeometry(props.children, GeometryStore)
}
