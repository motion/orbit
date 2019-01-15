import { FilterableProps, useFilterableResults } from './pureHooks/useFilterable'
import { useComputed } from 'mobx-react-lite'
import { useStoresSafe } from './useStoresSafe'
import { useState } from 'react'

// defaults to using the appstore active query

export default function OrbitFilterable(props: FilterableProps<any>) {
  const { appStore } = useStoresSafe()
  const [activeQuery, setActiveQuery] = useState('')

  useComputed(() => setActiveQuery(appStore.activeQuery), [])

  return useFilterableResults({
    query: activeQuery,
    ...props,
  })
}
