import { Model } from '@mcro/mediator'
import { merge } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { loadMany, loadOne, observeCount, observeMany, observeOne, save, loadCount } from '.'
import { ModelCache } from './ModelCache'

type UseModelOptions = {
  defaultValue?: any
  observe?: true
}

/*type ObserveModelOptions = {
  defaultValue?: any
  onChange?: (val: any) => any
}*/

/*function useObserveModel<ModelType, Args>(
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
}*/

// TODO we can now de-dupe and just re-use the same queries from useModel

function use<ModelType, Args>(
  type: "one"|"many"|"count", // manyAndCount
  model: Model<ModelType, Args, any>,
  query: Args | false,
  options: UseModelOptions = {},
): any {

  // we observe and update if necessary
  let observeFn: Function;
  if (type === 'one') {
    observeFn = observeOne

  } else if (type === 'many') {
    observeFn = observeMany

  } else if (type === 'count') {
    observeFn = observeCount
  }

  // store most recent value
  let defaultValue = options.defaultValue || {
    one: null,
    many: [],
    count: 0,
  }[type]

  const observeEnabled = options.observe === undefined || options.observe === true
  const [value, setValue] = useState(defaultValue)
  const subscription = useRef(null)
  const curQuery = useRef(null)

  const setValueAdvanced = (nextValue: any): boolean => {
    if (type === "one" || type === "many") {
      if (JSON.stringify(nextValue) !== JSON.stringify(value)) {
        // console.log(`set a new value`, nextValue)
        setValue(nextValue)
        return true
      }
    } else if (type === "count") {
      if (nextValue !== value) {
        setValue(nextValue)
        return true
      }
    }
    return false
  };

  const updateIfNew = (nextValue: any) => {
    const updated = setValueAdvanced(nextValue)
    if (updated) {
      // console.log(`updating cache`)
      ModelCache.add(model, type, query, nextValue)
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
      if (observeEnabled === false)
        return

      const isQueryChanged = JSON.stringify(curQuery.current) !== JSON.stringify(query)
      if (isQueryChanged === false)
        return

      // unsubscribe from previous subscription
      dispose()

      // subscribe new and update
      curQuery.current = query
      // console.log('subscribed', observeFn, query)
      subscription.current = observeFn(model, { args: query }).subscribe(updateIfNew)

      const entry = ModelCache.findEntryByQuery(model, type, query)
      if (entry) {
        // console.log(`entry told to update`, entry)
        updateIfNew(entry.value)
      }
    },
    [JSON.stringify(query), observeEnabled],
  )

  useEffect(
    () => {
      if (observeEnabled)
        return

      let cancelled = false

      if (type === 'one') {
        loadOne(model, { args: query }).then(nextValue => {
          if (!cancelled) {
            updateIfNew(nextValue)
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
