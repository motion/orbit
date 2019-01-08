import { Model } from '@mcro/mediator'
import { useEffect, useState, useRef } from 'react'
import { observeMany, observeOne } from '.'

function useObserve<ModelType, Args>(
  model: Model<ModelType, Args, any>,
  query: Args,
  defaultValue: any,
  multiple = false,
) {
  const subscription = useRef(null)
  const curQuery = useRef(null)
  const [value, setValue] = useState(defaultValue)
  const dispose = () => subscription.current && subscription.current.unsubscribe()

  // unmount
  useEffect(() => dispose, [])

  // on new query: subscribe, update
  useEffect(() => {
    const hasNewQuery = JSON.stringify(curQuery.current) !== JSON.stringify(query)
    if (hasNewQuery) {
      curQuery.current = query

      // unsubscribe last
      dispose()

      // subscribe new
      subscription.current = multiple
        ? observeMany(model, { args: query }).subscribe(setValue)
        : observeOne(model, { args: query }).subscribe(setValue)
    }
  })

  return value
}

export function useObserveMany<ModelType, Args>(
  model: Model<ModelType, Args, any>,
  query: Args,
  defaultValue: any = [],
): ModelType[] {
  return useObserve(model, query, defaultValue, true)
}

export function useObserveOne<ModelType, Args>(
  model: Model<ModelType, Args, any>,
  query: Args,
  defaultValue: any = null,
): ModelType {
  return useObserve(model, query, defaultValue, false)
}
