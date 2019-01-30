import { useObserver } from 'mobx-react-lite'
import { useCallback, useState } from 'react'
import { FilterableProps, useFilterableResults } from './pureHooks/useFilterableResults'
import { useStoresSafe } from './useStoresSafe'

// defaults to using the appstore active query

export function useOrbitFilterableResults<A>(props: FilterableProps<A>): A[] {
  const { appStore } = useStoresSafe()
  const [activeQuery, setActiveQuery] = useState('')

  useObserver(() => {
    if (appStore.activeQuery !== activeQuery) {
      setActiveQuery(appStore.activeQuery)
    }
  })

  const sortBy = useCallback(props.sortBy, [])

  return useFilterableResults({
    query: activeQuery,
    ...props,
    // never update this because it should be pure
    sortBy,
  })
}
