import { useObserver } from 'mobx-react-lite'
import { useState } from 'react'
import { FilterableProps, useFilterableResults } from './pureHooks/useFilterableResults'
import { useStoresSafe } from './useStoresSafe'

// defaults to using the appstore active query

export function useOrbitFilterableResults(props: FilterableProps<any>) {
  const { appStore } = useStoresSafe()
  const [activeQuery, setActiveQuery] = useState('')

  useObserver(() => {
    if (appStore.activeQuery !== activeQuery) {
      setActiveQuery(appStore.activeQuery)
    }
  })

  return useFilterableResults({
    query: activeQuery,
    ...props,
  })
}
