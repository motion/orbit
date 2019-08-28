import { Model } from '@o/mediator'
import { ImmutableUpdateFn, isDefined, OR_TIMED_OUT, orTimeout, shouldDebug } from '@o/utils'
import produce from 'immer'
import { omit } from 'lodash'
import { useCallback, useEffect, useRef, useState } from 'react'

import { queueUpdate } from './batchUpdate'
import { loadCount, loadMany, loadOne, observeCount, observeMany, observeOne, save } from './Mediator'

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
  sub && sub.unsubscribe()
}

// allow undefined for stuff like useBits() but dont allow useBits(null) useBits(false)
const hasQuery = (x: any) => {
  return x !== false && x !== null
}

const currentComponent = () => {
  if (process.env.NODE_ENV === 'development') {
    return require('react').__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner
      .current
  }
}

const useForceUpdate = () => {
  const forceUpdate = useState(0)[1]
  return useCallback(() => {
    forceUpdate(Math.random())
  }, [])
}

function use<ModelType, Args>(
  type: 'one' | 'many' | 'count',
  model: Model<ModelType, Args, any>,
  query?: Args | false,
  options?: UseModelOptions,
): any {
  const key = getKey(model.name, type, JSON.stringify(query))
  const observeEnabled = !options || (options.observe === undefined || options.observe === true)
  const defaultValue = options ? options.defaultValue : defaultValues[type]
  const forceUpdate = useForceUpdate()
  const state = useRef({
    key,
    value: defaultValue,
    subscription: null,
    waitForFirstResolve: false,
    hasDoneInitialCheck: false,
  })

  // they changed the key! we should reset valueRef.current
  if (state.current.key !== key) {
    state.current.key = key
    state.current.value = defaultValue
  }

  // unmount
  useEffect(() => dispose(state.current.subscription), [])

  // on new query: subscribe, update
  useEffect(() => {
    if (!hasQuery(query)) return
    if (state.current.waitForFirstResolve) return

    // unsubscribe from previous subscription
    dispose(state.current.subscription)

    let cancelled = false
    const update = next => {
      if (cancelled) return
      if (next === state.current.value) return
      if (next === undefined) return
      state.current.value = next
      if (process.env.NODE_ENV === 'development' && shouldDebug()) {
        console.log('useModel update', currentComponent(), key, next)
      }
      setTimeout(() => {
        delete PromiseCache[state.current.key]
      }, 200)
      queueUpdate(forceUpdate)
    }

    state.current.subscription = runUseQuery(model, type, query, observeEnabled, update)

    return () => {
      cancelled = true
    }
  }, [state.current.waitForFirstResolve, key, observeEnabled])

  const valueUpdater: ImmutableUpdateFn<any> = useCallback(updaterFn => {
    const finish = (val: any) => {
      const next = produce(val, updaterFn)
      if (process.env.NODE_ENV === 'development' && shouldDebug()) {
        console.debug(`useModel.save()`, model.name, next)
      }
      delete PromiseCache[state.current.key]
      save(model, next as any)
    }

    // note, if we use a select this would fail because we wouldn't have all the values to save
    // so if we have a select, we're going to fetch the full object first, then mutate, then save
    if (query && query['select']) {
      loadOne(model, { args: omit(query as any, 'select') }).then(finish)
    } else {
      finish(state.current.value)
    }
  }, [])

  let cache = PromiseCache[key]

  if (!state.current.hasDoneInitialCheck) {
    state.current.hasDoneInitialCheck = true

    if (!hasQuery(query)) {
      state.current.value = defaultValue
    } else {
      if (!cache) {
        state.current.waitForFirstResolve = true
        let resolve
        let resolved = false
        const promise = new Promise(res => {
          const finish = next => {
            clearTimeout(tm)
            if (!resolved) {
              resolved = true
              state.current.value = next
              cache.current = next
              if (process.env.NODE_ENV === 'development' && shouldDebug()) {
                console.log('useModel.resolve', key, currentComponent(), next)
              }
              state.current.waitForFirstResolve = false
              res()
            }
          }

          // timeout
          let tm = setTimeout(() => {
            console.error(`Query timed out ${JSON.stringify(query)}`)
            finish(defaultValue)
          }, 4000)

          state.current.subscription = runUseQuery(model, type, query, observeEnabled, finish)
        })
        cache = {
          read: promise,
          resolve,
          current: undefined,
        }
        PromiseCache[key] = cache
        if (process.env.NODE_ENV === 'development') {
          console.debug(`start query`, model.name, key)
        }
      }

      if (isDefined(cache.current)) {
        state.current.value = cache.current
      } else {
        if (cache.read) {
          throw cache.read
        } else {
          // todo we may not need this since we timeout the original query
          throw new Promise((res, rej) => {
            orTimeout(cache.read, 2000)
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
    return [state.current.value, valueUpdater]
  }

  return state.current.value
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
