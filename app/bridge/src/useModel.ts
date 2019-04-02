import { Model } from '@o/mediator'
import { assign } from 'lodash'
import { useCallback, useEffect, useRef, useState } from 'react'
import { loadCount, loadMany, loadOne, observeCount, observeMany, observeOne, save } from '.'

type UseModelOptions = {
  defaultValue?: any
  observe?: boolean
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
  // const id = useRef(Math.random())

  const dispose = () => {
    subscription.current && subscription.current.unsubscribe()
  }

  // unmount
  useEffect(() => dispose, [])

  // on new query: subscribe, update
  useEffect(() => {
    if (query === false) return

    const isQueryChanged = JSON.stringify(curQuery.current) !== queryKey
    if (isQueryChanged === false) return
    curQuery.current = query

    // unsubscribe from previous subscription
    dispose()

    let cancelled = false
    const update = next => {
      if (cancelled) return
      if (next === valueRef.current) return
      if (valueRef.current === options.defaultValue && next === null) return
      valueRef.current = next
      forceUpdate(Math.random())
    }

    if (observeEnabled) {
      if (type === 'one') {
        subscription.current = observeOne(model, { args: query }).subscribe(update)
      } else if (type === 'many') {
        subscription.current = observeMany(model, { args: query }).subscribe(update)
      } else if (type === 'count') {
        subscription.current = observeCount(model, { args: query }).subscribe(update)
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

  if (type === 'one' || type === 'many') {
    return [value, valueUpdater]
  }

  return value
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
