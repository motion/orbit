import { Model } from '@mcro/mediator'
import { useEffect, useState, useRef } from 'react'
import { observeMany } from '.'

function useObserve<ModelType, Args>(
  Model: Model<ModelType, Args, any>,
  query: Args,
  defaultValue: any,
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
      subscription.current = observeMany(Model, { args: query }).subscribe(setValue)
    }
  })

  return value
}

export function useObserveMany<ModelType, Args>(
  Model: Model<ModelType, Args, any>,
  query: Args,
  defaultValue: any = [],
): ModelType[] {
  return useObserve(Model, query, defaultValue)
}

export function useObserveOne<ModelType, Args>(
  Model: Model<ModelType, Args, any>,
  query: Args,
  defaultValue: any = null,
): ModelType {
  return useObserve(Model, query, defaultValue)
}
