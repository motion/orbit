import { Model } from '@mcro/mediator'
import { merge } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { loadMany, loadOne, observeCount, observeMany, observeOne, save, loadCount } from '.'
import { ModelCache } from './ModelCache'

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

  const updateIfNew = (nextValue: any) => {
    if (type === 'one' || type === 'many') {
      if (JSON.stringify(nextValue) !== JSON.stringify(value)) {
        setValue(nextValue)
        ModelCache.add(model, type, query, nextValue)
      }
    } else if (type === 'count') {
      if (nextValue !== value) {
        setValue(nextValue)
        ModelCache.add(model, type, query, nextValue)
      }
    }
  }

  const dispose = () => {
    if (subscription.current) {
      // console.log('unsubscribed', curQuery.current)
      subscription.current.unsubscribe()
      ModelCache.remove(model, type, curQuery.current)
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
          subscription.current = observeOne(model, { args: query }).subscribe(updateIfNew)
        } else if (type === 'many') {
          subscription.current = observeMany(model, { args: query }).subscribe(updateIfNew)
        } else if (type === 'count') {
          subscription.current = observeCount(model, { args: query }).subscribe(updateIfNew)
        }
      } else {
        if (type === 'one') {
          loadOne(model, { args: query }).then(nextValue => {
            if (!cancelled) updateIfNew(nextValue)
          })
        } else if (type === 'many') {
          loadMany(model, { args: query }).then(nextValue => {
            if (!cancelled) updateIfNew(nextValue)
          })
        } else if (type === 'count') {
          loadCount(model, { args: query }).then(nextValue => {
            if (!cancelled) updateIfNew(nextValue)
          })
        }
      }

      const entry = ModelCache.findEntryByQuery(model, type, query)
      if (entry) {
        // console.log(`entry told to update`, entry)
        updateIfNew(entry.value)
      }

      return () => {
        cancelled = true
      }
    },
    [JSON.stringify(query), observeEnabled],
  )

  const valueUpdater = (next: Partial<ModelType> | Partial<ModelType>[]) => {
    // save async after update
    if (type === 'one') {
      const nextValue = merge({ ...value }, next)
      updateIfNew(nextValue)
      save(model, nextValue)
    } else if (type === 'many') {
      const nextValue = merge([...value], next)
      updateIfNew(nextValue)
      for (let item of next as Partial<ModelType>[]) {
        save(model, item as any)
      }
    }
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
