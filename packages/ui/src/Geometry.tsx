import { decorate } from '@o/use-store'
import { MotionValue, useSpring, useTransform } from 'framer-motion'
import { SpringProps } from 'popmotion'
import { memo, useContext, useEffect } from 'react'
import React from 'react'
import { TransformOptions } from 'stream'

import { useLazyRef } from './hooks/useLazyRef'
import { useScrollProgress } from './hooks/useScrollProgress'
import { ScrollableRefContext } from './View/ScrollableView'

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

class AnimationStore {
  animationHooks = new HooksStore<MotionValue>()
  frozen = false

  freeze() {
    this.frozen = true
  }

  transform(to: any): AnimationStore
  transform(from: number[], to?: any[], options?: TransformOptions): AnimationStore {
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

type StoredRoutine = {
  key: string
  store: AnimationStore
}

class GeometryStore {
  routines: StoredRoutine[] = []
  hooksKey = 0
  curCall = 0

  onRender() {
    this.curCall = 0
  }

  scrollIntersection(key: string = '') {
    const curRoutine = this.routines[this.curCall]
    console.log('go go', curRoutine, key, this.curCall)
    let shouldSwap = false
    if (curRoutine) {
      if (curRoutine.key !== key) {
        shouldSwap = true
      } else {
        curRoutine.store.freeze()
        return curRoutine.store
      }
    }
    console.log('create new')
    const store = new AnimationStore()
    store.animationHooks.addHook(() => {
      const ref = useContext(ScrollableRefContext)
      return useScrollProgress({
        ref,
      })
    })
    if (shouldSwap) {
      // changing key
      this.routines.splice(this.routines.indexOf(curRoutine), 1, { key, store })
    } else {
      this.routines.push({ key, store })
    }
    this.hooksKey = Math.random()
    this.curCall++
    return store
  }
}

export function Geometry(props: { children: (geometry: GeometryStore) => React.ReactNode }) {
  const geometry = useLazyRef(() => new GeometryStore()).current
  const [hookVals, setHooksVals] = React.useState([])
  const hooks = geometry.routines.map(x => x.store.animationHooks.hooks).flat()
  geometry.onRender()
  console.log('status', geometry.hooksKey, hooks, hookVals)
  return (
    <>
      <DynamicHooks key={geometry.hooksKey} hooks={hooks} onHooksComplete={setHooksVals} />
      {props.children(geometry)}
    </>
  )
}

const DynamicHooks = memo((props: { hooks: Function[]; onHooksComplete: (val: any[]) => void }) => {
  let hooks = []
  for (const hook of props.hooks) {
    hooks.push(hook(hooks))
  }
  useEffect(() => {
    props.onHooksComplete(hooks)
  }, [])
  return null
})
