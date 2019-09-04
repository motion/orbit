import { decorate, useForceUpdate } from '@o/use-store'
import { MotionValue, useSpring, useTransform } from 'framer-motion'
import { SpringProps } from 'popmotion'
import { memo, useContext, useLayoutEffect } from 'react'
import React from 'react'

import { useLazyRef } from './hooks/useLazyRef'
import { useOnHotReload } from './hooks/useOnHotReload'
import { useOnMount } from './hooks/useOnMount'
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
}

class GeometryStore {
  stores: AnimationStore[] = []
  curCall = 0

  onRender() {
    this.curCall = 0
  }

  setValues(index: number, val?: any[]) {
    this.stores[index].values = val
    this.update()
  }

  clear() {
    this.stores = []
    this.curCall = 0
  }

  cb = null
  onUpdated(cb: Function) {
    this.cb = cb
  }

  tm = null
  update() {
    clearTimeout(this.tm)
    this.tm = setTimeout(() => {
      this.cb()
    })
  }

  // hooks-like
  addStore(store: AnimationStore) {
    this.curCall++
    this.stores = [...this.stores, store]
    this.update()
  }

  scrollIntersection() {
    const curStore = this.stores[this.curCall]
    if (curStore) {
      console.log('frozen reutrning', curStore)
      curStore.freeze()
      return curStore
    }
    const store = new AnimationStore()
    store.animationHooks.addHook(() => {
      const ref = useContext(ScrollableRefContext)
      return useScrollProgress({
        ref,
      })
    })
    this.addStore(store)
    return store
  }
}

export function Geometry(props: { children: (geometry: GeometryStore) => React.ReactNode }) {
  const geometry = useLazyRef(() => new GeometryStore()).current
  const update = useForceUpdate()
  geometry.onRender()

  useOnMount(() => {
    geometry.onUpdated(update)
  })

  useOnHotReload(() => {
    geometry.clear()
  })

  return (
    <>
      {geometry.stores.map((store, index) => (
        <DynamicHooks
          key={index}
          hooks={store.animationHooks.hooks}
          onHooksComplete={values => geometry.setValues(index, values)}
        />
      ))}
      {props.children(geometry)}
    </>
  )
}

const DynamicHooks = memo((props: { hooks: Function[]; onHooksComplete: (val: any[]) => void }) => {
  const hooks = []
  for (const hook of props.hooks) {
    hooks.push(hook(hooks))
  }
  useLayoutEffect(() => {
    props.onHooksComplete(hooks)
  }, [])
  return null
})
