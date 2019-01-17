import { Model } from '@mcro/mediator'
import { useEffect, useState, useRef } from 'react'
import { observeMany, observeOne, observeCount, observeManyAndCount, loadOne, save } from '.'

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
  defaultValue: any,
  queryRunner: Function,
) {
  const subscription = useRef(null)
  const curQuery = useRef(null)
  const [value, setValue] = useState(defaultValue)
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

        // subscribe new
        subscription.current = queryRunner(model, { args: query }).subscribe(setValue)
      }
    },
    [JSON.stringify(query)],
  )

  return value
}

export function useObserveMany<ModelType, Args>(
  model: Model<ModelType, Args, any>,
  query: Args | false,
  options: ObserveModelOptions = {},
): ModelType[] {
  return useObserveModel(model, query, options.defaultValue || [], observeMany)
}

export function useObserveOne<ModelType, Args>(
  model: Model<ModelType, Args, any>,
  query: Args | false,
  options: ObserveModelOptions = {},
): ModelType {
  return useObserveModel(model, query, options.defaultValue || null, observeOne)
}

export function useObserveCount<ModelType, Args>(
  model: Model<ModelType, Args, any>,
  query: Args | false,
  options: ObserveModelOptions = {},
) {
  return useObserveModel(model, query, options.defaultValue || 0, observeCount)
}

export function useObserveManyAndCount<ModelType, Args>(
  model: Model<ModelType, Args, any>,
  query: Args | false,
  options: ObserveModelOptions = {},
) {
  return useObserveModel(model, query, options.defaultValue || 0, observeManyAndCount)
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

  // we observe and update if necessary
  useObserveOne(model, options.observe && query, {
    defaultValue,
    onChange: nextValue => {
      if (JSON.stringify(nextValue) !== JSON.stringify(value)) {
        setValue(nextValue)
      }
    },
  })

  useEffect(
    () => {
      if (query == false) {
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
    [JSON.stringify(query)],
  )

  const update = (next: Partial<ModelType>) => {
    const nextValue = {
      ...value,
      ...next,
    }
    setValue(nextValue)
    // save async after update
    save(model, nextValue)
  }

  return [value, update]
}
