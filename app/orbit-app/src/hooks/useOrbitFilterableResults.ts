import { useCallback, useState } from 'react'
import { FilterableProps, useFilterableResults } from './pureHooks/useFilterableResults'
import { useStoresSimple } from './useStores'

// defaults to using the appstore active query

export function useOrbitFilterableResults<A>(props: FilterableProps<A>): A[] {
  const { appStore } = useStoresSimple()
  const [activeQuery, setActiveQuery] = useState('')

  // useObserver(() => {
  //   console.log('get appstpore', appStore)
  //   if (appStore.activeQuery !== activeQuery) {
  //     setActiveQuery(appStore.activeQuery)
  //   }
  // })

  const sortBy = useCallback(props.sortBy, [])

  return useFilterableResults({
    query: activeQuery,
    ...props,
    // never update this because it should be pure
    sortBy,
  })
}
