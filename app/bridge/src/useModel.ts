import { Model } from '@o/mediator'
import { isDefined, OR_TIMED_OUT, orTimeout } from '@o/utils'
import produce from 'immer'
import { omit } from 'lodash'
import { useCallback, useEffect, useRef, useState } from 'react'

import { loadCount, loadMany, loadOne, observeCount, observeMany, observeOne, save } from './bridgeCommands'

// enforce immutable style updates otherwise you hit insane cache issus
type UpdateFn<A> = (draft: A) => A | void
export type ImmutableUpdateFn<A> = (cb: UpdateFn<A>) => any

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

const defaultValues = {
  one: null,
  many: [],
  count: 0,
}

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

// allow undefined for stuff like useBits() but dont allow useBits(null) useBits(false)
const hasQuery = (x: any) => {
  return x !== false && x !== null
}

function use<ModelType, Args>(
  type: 'one' | 'many' | 'count',
  model: Model<ModelType, Args, any>,
  query?: Args | false,
  options?: UseModelOptions,
): any {
  const queryKey = JSON.stringify(query)
  const observeEnabled = !options || (options.observe === undefined || options.observe === true)
  const forceUpdate = useState(0)[1]
  const valueRef = useRef(options ? options.defaultValue : undefined)
  const subscription = useRef<any>(null)
  const yallReadyKnow = useRef(false)

  // unmount
  useEffect(() => dispose(subscription), [])

  // on new query: subscribe, update
  useEffect(() => {
    if (!hasQuery(query)) return
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
      console.log(
        'updating from subscription',
        `${JSON.stringify(valueRef.current, null, 2)}
      ${JSON.stringify(next, null, 2)}
      `,
      )
      forceUpdate(Math.random())
    }

    subscription.current = runUseQuery(model, type, query, observeEnabled, update)

    return () => {
      cancelled = true
    }
  }, [queryKey, observeEnabled])

  const valueUpdater: ImmutableUpdateFn<any> = useCallback(
    updaterFn => {
      const finish = (val: any) => {
        const next = produce(val, updaterFn)
        if (process.env.NODE_ENV === 'development') {
          console.debug(`save model`, model.name, next)
        }
        save(model, next as any)
      }

      // note, if we use a select this would fail because we wouldn't have all the values to save
      // so if we have a select, we're going to fetch the full object first, then mutate, then save
      if (query && query['select']) {
        loadOne(model, { args: omit(query as any, 'select') }).then(finish)
      } else {
        finish(valueRef.current)
      }
    },
    [queryKey],
  )

  if (!isDefined(valueRef.current)) {
    const key = getKey(model.name, type, queryKey)
    let cache = PromiseCache[key]

    if (!hasQuery(query)) {
      valueRef.current = defaultValues[type]
    } else {
      if (!cache) {
        let resolve
        let resolved = false
        const promise = new Promise(res => {
          yallReadyKnow.current = true
          subscription.current = runUseQuery(model, type, query, observeEnabled, next => {
            // TODO why is this coming back undefined
            if (!isDefined(next)) return
            if (!resolved) {
              valueRef.current = next
              cache.current = next
              setTimeout(() => {
                delete PromiseCache[key]
              }, 50)
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
        if (cache.read) {
          throw cache.read
        } else {
          throw new Promise((res, rej) => {
            orTimeout(cache.read, 1000)
              .then(res)
              .catch(err => {
                if (err === OR_TIMED_OUT) {
                  console.warn('Model query timed out', model, query)
                  cache.current = defaultValues[type]
                } else {
                  rej(err)
                }
              })
          })
        }
      }
    }
  }

  if (type === 'one' || type === 'many') {
    return [valueRef.current, valueUpdater]
  }

  return valueRef.current
}

export function useModel<ModelType, Args>(
  model: Model<ModelType, Args, any>,
  query?: Args | false,
  options?: UseModelOptions,
): [ModelType | null, ImmutableUpdateFn<ModelType>] {
  return use('one', model, query, options)
}

export function useModels<ModelType, Args>(
  model: Model<ModelType, Args, any>,
  query?: Args | false,
  options?: UseModelOptions,
): [ModelType[], ImmutableUpdateFn<ModelType[]>] {
  return use('many', model, query, options)
}

export function useModelCount<ModelType, Args>(
  model: Model<ModelType, Args, any>,
  query?: Args | false,
  options?: UseModelOptions,
): number {
  return use('count', model, query, options)
}
