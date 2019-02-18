import { useReaction } from '@mcro/black'
import { useCallback } from 'react'
import { FilterableProps, useFilterableResults } from './pureHooks/useFilterableResults'
import { useStoresSimple } from './useStores'

export function useOrbitFilterableResults<A>(props: FilterableProps<A>): A[] {
  const { appStore } = useStoresSimple()
  const activeQuery = useReaction(() => appStore.activeQuery)
  const sortBy = useCallback(props.sortBy, [])
  return useFilterableResults({
    query: activeQuery,
    ...props,
    // never update this because it should be pure
    sortBy,
  })
}
