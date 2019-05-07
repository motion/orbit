import { Model } from '@o/mediator'
import { isDefined } from '@o/utils'
import { assign } from 'lodash'
import { useCallback, useEffect, useRef, useState } from 'react'

import { loadCount, loadMany, loadOne, observeCount, observeMany, observeOne, save } from '.'

export type UseModelOptions = {
  defaultValue?: any
  observe?: boolean
}

const PromiseCache: {
  [key: string]: {
    read: Promise<any>
    resolve: Function
    current: any
  }
} = {}

const getKey = (a, b, c) => `${a}${b}${c}`

// const defaultValues = {
//   one: null,
//   many: [],
//   count: 0,
// }

const runUseQuery = (model: any, type: string, query: Object, observe: boolean, update: any) => {
  if (observe) {
    if (type === 'one') {
      return observeOne(model, { args: query }).subscribe(update)
    } else if (type === 'many') {
      return observeMany(model, { args: query }).subscribe(update)
    } else if (type === 'count') {
      return observeCount(model, { args: query }).subscribe(update)
    }
  } else {
    if (type === 'one') {
      loadOne(model, { args: query }).then(update)
    } else if (type === 'many') {
      loadMany(model, { args: query }).then(update)
    } else if (type === 'count') {
      loadCount(model, { args: query }).then(update)
    }
  }
  throw new Error('unreachable')
}

const dispose = sub => {
  sub.current && sub.current.unsubscribe()
}

function use<ModelType, Args>(
  type: 'one' | 'many' | 'count',
  model: Model<ModelType, Args, any>,
  query: Args | false,
  options: UseModelOptions = {},
): any {
  const queryKey = JSON.stringify(query)
  const observeEnabled = options.observe === undefined || options.observe === true
  const forceUpdate = useState(0)[1]
  const valueRef = useRef(options.defaultValue)
  const subscription = useRef<any>(null)
  const yallReadyKnow = useRef(false)

  // unmount
  useEffect(() => dispose(subscription), [])

  // on new query: subscribe, update
  useEffect(() => {
    if (query === false) return
    if (yallReadyKnow.current) {
      yallReadyKnow.current = false
      return
    }

    // unsubscribe from previous subscription
    dispose(subscription)

    let cancelled = false
    const update = next => {
      if (cancelled) return
      if (next === valueRef.current) return
      if (next === undefined) return
      valueRef.current = next
      forceUpdate(Math.random())
    }

    subscription.current = runUseQuery(model, type, query, observeEnabled, update)

    return () => {
      cancelled = true
    }
  }, [queryKey, observeEnabled])

  const valueUpdater = useCallback(
    next => {
      // we can't use merge here since lodash's merge doesn't merge arrays properly
      // in the case if we would need merge again - we need to write it custom with arrays in mind
      save(model, assign({}, valueRef.current, next))
    },
    [queryKey],
  )

  if (query !== false && !isDefined(valueRef.current)) {
    const key = getKey(model.name, type, queryKey)
    let cache = PromiseCache[key]

    if (!cache) {
      let resolve
      const promise = new Promise(res => {
        yallReadyKnow.current = true
        subscription.current = runUseQuery(model, type, query, observeEnabled, next => {
          console.log('got', key, next, PromiseCache)
          if (isDefined(next)) {
            cache.current = next
            valueRef.current = next
            // clear cache
            setTimeout(() => {
              delete PromiseCache[key]
            }, 100)
            res()
          }
        })
      })
      cache = PromiseCache[key] = {
        read: promise,
        resolve,
        current: undefined,
      }
    }

    if (isDefined(cache.current)) {
      valueRef.current = cache.current
    } else {
      console.log('throwing', key)
      throw cache.read
    }
  }

  if (type === 'one' || type === 'many') {
    return [valueRef.current, valueUpdater]
  }

  return valueRef.current
}

export function useModel<ModelType, Args>(
  model: Model<ModelType, Args, any>,
  query: Args | false,
  options: UseModelOptions = {},
): [ModelType | null, ((next: Partial<ModelType>) => any)] {
  return use('one', model, query, options)
}

export function useModels<ModelType, Args>(
  model: Model<ModelType, Args, any>,
  query: Args | false,
  options: UseModelOptions = {},
): [ModelType[], ((next: Partial<ModelType>[]) => any)] {
  return use('many', model, query, options)
}

export function useModelCount<ModelType, Args>(
  model: Model<ModelType, Args, any>,
  query: Args | false,
  options: UseModelOptions = {},
): number {
  return use('count', model, query, options)
}
