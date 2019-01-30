import { Model } from '@mcro/mediator'
import { merge } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { loadMany, loadOne, observeCount, observeMany, observeOne, save, loadCount } from '.'
import { ModelCache } from './ModelCache'

type UseModelOptions = {
  defaultValue?: any
  observe?: true
}

type ObserveModelOptions = {
  defaultValue?: any
  onChange?: (val: any) => any
}

function useObserveModel<ModelType, Args>(
  model: Model<ModelType, Args, any>,
  query: Args | false,
  options: ObserveModelOptions & { observeFn: Function },
) {
  const subscription = useRef(null)
  const curQuery = useRef(null)
  const [value, setValue] = useState(options.defaultValue)
  const dispose = () => subscription.current && subscription.current.unsubscribe()

  // unmount
  useEffect(() => dispose, [])

  // on new query: subscribe, update
  useEffect(
    () => {
      if (query === false) {
        return
      }
      const hasNewQuery = JSON.stringify(curQuery.current) !== JSON.stringify(query)
      if (hasNewQuery) {
        curQuery.current = query

        // unsubscribe last
        dispose()

        // subscribe new and update
        subscription.current = options.observeFn(model, { args: query }).subscribe(nextValue => {
          if (options.onChange) {
            options.onChange(nextValue)
          }
          if (JSON.stringify(value) !== JSON.stringify(nextValue)) {
            setValue(nextValue)
          }
        })
      }
    },
    [JSON.stringify(query), options.onChange],
  )

  return value
}

// TODO we can now de-dupe and just re-use the same queries from useModel

function use<ModelType, Args>(
  type: "one"|"many"|"count", // manyAndCount
  model: Model<ModelType, Args, any>,
  query: Args | false,
  options: UseModelOptions = {},
): any {

  // store most recent value
  const defaultValue = options.defaultValue || {
    one: null,
    many: [],
    count: 0,
  }[type]
  const observeEnabled = options.observe === undefined || options.observe === true
  const [value, setValue] = useState(defaultValue)

  const updateIfNew = (nextValue: any) => {
    if (type === "one" || type === "many") {
      if (JSON.stringify(nextValue) !== JSON.stringify(value)) {
        setValue(nextValue)
        if (nextValue instanceof Array) { // for many models
          for (let value of nextValue) {
            ModelCache.set(model, value)
          }
        } else { // for single model
          ModelCache.set(model, nextValue)
        }
      }
    } else if (type === "count") {
      if (nextValue !== value)
        setValue(nextValue)
    }
  }

  // we observe and update if necessary
  if (type === 'one') {
    useObserveModel(model, observeEnabled && query, {
      defaultValue,
      onChange: updateIfNew,
      observeFn: observeOne
    })

  } else if (type === 'many') {
    useObserveModel(model, observeEnabled && query, {
      defaultValue,
      onChange: updateIfNew,
      ...options,
      observeFn: observeMany
    })

  } else if (type === 'count') {
    useObserveModel(model, observeEnabled && query, {
      defaultValue,
      onChange: updateIfNew,
      ...options,
      observeFn: observeCount
    })
  }

  useEffect(
    () => {
      if (query === false || observeEnabled) {
        return
      }
      let cancelled = false

      if (type === 'one') {
        loadOne(model, { args: query }).then(nextValue => {
          if (!cancelled) {
            updateIfNew(nextValue)
            // setValue(nextValue) // todo: can we use updateIfNew here?
          }
        })

      } else if (type === 'many') {
        loadMany(model, { args: query }).then(nextValue => {
          if (!cancelled) {
            updateIfNew(nextValue)
          }
        })

      } else if (type === 'count') {
        loadCount(model, { args: query }).then(nextValue => {
          if (!cancelled) {
            updateIfNew(nextValue)
          }
        })
      }

      return () => {
        cancelled = true
      }
    },
    [JSON.stringify(query), observeEnabled],
  )

  const update = (next: Partial<ModelType>|Partial<ModelType>[]) => {
    // save async after update
    // todo: what if save failed?
    if (type === 'one') {
      const nextValue = merge({ ...value }, next)
      updateIfNew(nextValue)
      save(model, nextValue)

    } else if (type === 'many') {
      const nextValue = merge([ ...value ], next)
      updateIfNew(nextValue)
      for (let item of (next as Partial<ModelType>[])) {
        save(model, item as any)
      }
    }
  }

  if (type === 'one' || type === 'many') {
    return [value, update]
  }

  return value
}

export function useModel<ModelType, Args>(
  model: Model<ModelType, Args, any>,
  query: Args | false,
  options: UseModelOptions = {},
): [ModelType, ((next: Partial<ModelType>) => any)] {
  return use("one", model, query, options)
}

export function useModels<ModelType, Args>(
  model: Model<ModelType, Args, any>,
  query: Args | false,
  options: UseModelOptions = {},
): [ModelType[], ((next: Partial<ModelType>[]) => any)] {
  return use("many", model, query, options)
}

export function useModelCount<ModelType, Args>(
  model: Model<ModelType, Args, any>,
  query: Args | false,
  options: UseModelOptions = {},
): number {
  return use("count", model, query, options)
}
