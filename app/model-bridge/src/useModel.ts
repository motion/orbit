import { Model } from '@mcro/mediator'
import { useEffect, useState, useRef } from 'react'
import { observeMany, observeOne, observeCount, observeManyAndCount } from '.'

function useObserve<ModelType, Args>(
  model: Model<ModelType, Args, any>,
  query: Args,
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
  useEffect(() => {
    const hasNewQuery = JSON.stringify(curQuery.current) !== JSON.stringify(query)
    if (hasNewQuery) {
      curQuery.current = query

      // unsubscribe last
      dispose()

      // subscribe new
      subscription.current = queryRunner(model, { args: query }).subscribe(setValue)
    }
  })

  return value
}

export function useObserveMany<ModelType, Args>(
  model: Model<ModelType, Args, any>,
  query: Args,
  defaultValue: any = [],
): ModelType[] {
  return useObserve(model, query, defaultValue, observeMany)
}

export function useObserveOne<ModelType, Args>(
  model: Model<ModelType, Args, any>,
  query: Args,
  defaultValue: any = null,
): ModelType {
  return useObserve(model, query, defaultValue, observeOne)
}

export function useObserveCount<ModelType, Args>(
  model: Model<ModelType, Args, any>,
  query: Args,
  defaultValue: any = 0,
) {
  return useObserve(model, query, defaultValue, observeCount)
}

export function useObserveManyAndCount<ModelType, Args>(
  model: Model<ModelType, Args, any>,
  query: Args,
  defaultValue: any = 0,
) {
  return useObserve(model, query, defaultValue, observeManyAndCount)
}
