import { Model } from '@mcro/mediator'
import { merge } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { loadMany, loadOne, observeCount, observeMany, observeOne, save, loadCount } from '.'

type UseModelOptions = {
  defaultValue?: any
  observe?: true
}

function use<ModelType, Args>(
  type: 'one' | 'many' | 'count',
  model: Model<ModelType, Args, any>,
  query: Args | false,
  options: UseModelOptions = {},
): any {

  const observeEnabled = options.observe === undefined || options.observe === true
  const [value, setValue] = useState(
    options.defaultValue ||
      {
        one: null,
        many: [],
        count: 0,
      }[type],
  )
  const subscription = useRef(null)
  const curQuery = useRef(null)

  const dispose = () => {
    if (subscription.current) {
      subscription.current.unsubscribe()
    }
  }

  // unmount
  useEffect(dispose, [])

  // on new query: subscribe, update
  useEffect(
    () => {
      let cancelled = false

      if (query === false) return

      const isQueryChanged = JSON.stringify(curQuery.current) !== JSON.stringify(query)
      if (isQueryChanged === false) return

      // unsubscribe from previous subscription
      dispose()

      // subscribe new and update
      curQuery.current = query

      if (observeEnabled) {
        if (type === 'one') {
          subscription.current = observeOne(model, { args: query, cacheValue: value }).subscribe(setValue)
        } else if (type === 'many') {
          subscription.current = observeMany(model, { args: query, cacheValue: value }).subscribe(setValue)
        } else if (type === 'count') {
          subscription.current = observeCount(model, { args: query, cacheValue: value }).subscribe(setValue)
        }
      } else {
        if (type === 'one') {
          loadOne(model, { args: query }).then(nextValue => {
            if (!cancelled) setValue(nextValue)
          })
        } else if (type === 'many') {
          loadMany(model, { args: query }).then(nextValue => {
            if (!cancelled) setValue(nextValue)
          })
        } else if (type === 'count') {
          loadCount(model, { args: query }).then(nextValue => {
            if (!cancelled) setValue(nextValue)
          })
        }
      }

      return () => {
        cancelled = true
      }
    },
    [JSON.stringify(query), observeEnabled],
  )

  const valueUpdater = (next: any) => {
    const nextValue = merge(type === 'many' ? [ ...value ] : { ...value }, next)
    setValue(nextValue)
    save(model, nextValue, {
      type,
      args: query,
      cacheValue: value
    })
  }

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
