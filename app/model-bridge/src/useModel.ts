import { Model } from '@mcro/mediator'
import { useEffect, useRef, useState } from 'react'
import { loadOne, observeCount, observeMany, observeManyAndCount, observeOne, save } from '.'

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

const defaultsMany = { defaultValue: [] }
const defaultsOne = { defaultValue: null }
const defaultsCount = { defaultValue: 0 }

export function useObserveMany<ModelType, Args>(
  model: Model<ModelType, Args, any>,
  query: Args | false,
  options: ObserveModelOptions = {},
): ModelType[] {
  return useObserveModel(model, query, { ...defaultsMany, ...options, observeFn: observeMany })
}

export function useObserveOne<ModelType, Args>(
  model: Model<ModelType, Args, any>,
  query: Args | false,
  options: ObserveModelOptions = {},
): ModelType {
  return useObserveModel(model, query, { ...defaultsOne, ...options, observeFn: observeOne })
}

export function useObserveCount<ModelType, Args>(
  model: Model<ModelType, Args, any>,
  query: Args | false,
  options: ObserveModelOptions = {},
) {
  return useObserveModel(model, query, { ...defaultsCount, ...options, observeFn: observeCount })
}

export function useObserveManyAndCount<ModelType, Args>(
  model: Model<ModelType, Args, any>,
  query: Args | false,
  options: ObserveModelOptions = {},
) {
  return useObserveModel(model, query, {
    ...defaultsCount,
    ...options,
    observeFn: observeManyAndCount,
  })
}

// TODO we can now de-dupe and just re-use the same queries from useModel

// allows fetching a model and then updating it easily
export function useModel<ModelType, Args>(
  model: Model<ModelType, Args, any>,
  query: Args | false,
  options: UseModelOptions = {},
): [ModelType, ((next: Partial<ModelType>) => any)] {
  // store most recent value
  const defaultValue = options.defaultValue || null
  const [value, setValue] = useState(defaultValue)

  const updateIfNew = (nextValue: any) => {
    if (JSON.stringify(nextValue) !== JSON.stringify(value)) {
      setValue(nextValue)
    }
  }

  // we observe and update if necessary
  useObserveOne(model, !!options.observe && query, {
    defaultValue,
    onChange: updateIfNew,
  })

  useEffect(
    () => {
      if (query == false || options.observe) {
        return
      }
      let cancelled = false
      loadOne(model, { args: query }).then(nextValue => {
        if (!cancelled) {
          setValue(nextValue)
        }
      })
      return () => {
        cancelled = true
      }
    },
    [JSON.stringify(query), !!options.observe],
  )

  const update = (next: Partial<ModelType>) => {
    const nextValue = {
      ...value,
      ...next,
    }
    updateIfNew(nextValue)
    // save async after update
    save(model, nextValue)
  }

  return [value, update]
}
