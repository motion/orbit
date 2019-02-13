import { Model } from '@mcro/mediator'
import { merge } from 'lodash'
import { useCallback, useEffect, useRef, useState } from 'react'
import isEqual from 'react-fast-compare'
import {
  loadCount,
  loadMany,
  loadOne,
  observeCount,
  observeMany,
  observeOne,
  save,
} from './mediator'

type UseModelOptions = {
  defaultValue?: any
  observe?: true
}

const defaultValues = {
  one: null,
  many: [],
  count: 0,
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
  const valueRef = useRef(options.defaultValue || defaultValues[type])
  const value = valueRef.current
  const subscription = useRef(null)
  const curQuery = useRef(null)

  const dispose = () => {
    if (subscription.current) {
      subscription.current.unsubscribe()
    }
  }

  // unmount
  useEffect(() => dispose, [])

  const update = next => {
    if (isEqual(next, valueRef.current)) return
    valueRef.current = next
    forceUpdate(Math.random())
  }

  // on new query: subscribe, update
  useEffect(
    () => {
      let cancelled = false

      if (query === false) return

      const isQueryChanged = JSON.stringify(curQuery.current) !== queryKey
      if (isQueryChanged === false) return

      // unsubscribe from previous subscription
      dispose()

      // subscribe new and update
      curQuery.current = query

      if (observeEnabled) {
        if (type === 'one') {
          subscription.current = observeOne(model, { args: query, cacheValue: value }).subscribe(
            update,
          )
        } else if (type === 'many') {
          subscription.current = observeMany(model, { args: query, cacheValue: value }).subscribe(
            update,
          )
        } else if (type === 'count') {
          subscription.current = observeCount(model, { args: query, cacheValue: value }).subscribe(
            update,
          )
        }
      } else {
        if (type === 'one') {
          loadOne(model, { args: query }).then(nextValue => {
            if (!cancelled) update(nextValue)
          })
        } else if (type === 'many') {
          loadMany(model, { args: query }).then(nextValue => {
            if (!cancelled) update(nextValue)
          })
        } else if (type === 'count') {
          loadCount(model, { args: query }).then(nextValue => {
            if (!cancelled) update(nextValue)
          })
        }
      }

      return () => {
        cancelled = true
      }
    },
    [queryKey, observeEnabled],
  )

  const valueUpdater = useCallback(
    next => {
      save(model, merge({}, valueRef.current, next))
    },
    [queryKey],
  )

  if (type === 'one' || type === 'many') {
    return [value, valueUpdater]
  }

  return value
}

export function useModel<ModelType, Args>(
  model: Model<ModelType, Args, any>,
  query: Args | false,
  options: UseModelOptions = {},
): [ModelType, ((next: Partial<ModelType>) => any)] {
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
