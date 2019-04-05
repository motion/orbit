import { isEqual } from '@o/fast-compare'
import { useReaction } from '@o/use-store'
import { useRef } from 'react'
import { QueryFilterStore } from '../stores/QueryFilterStore'
import { useStoresSimple } from './useStores'

export type SearchState = {
  query: string
  filters: QueryFilterStore
  dateState: QueryFilterStore['dateState']
  toggleFilterActive: QueryFilterStore['toggleFilterActive']
  activeFilters: QueryFilterStore['activeFilters']
  activeDateFilters: QueryFilterStore['activeDateFilters']
}

export function useSearchState(cb?: (state: SearchState) => any) {
  const { appStore, queryStore } = useStoresSimple()
  const { queryFilters } = queryStore
  const last = useRef(null)
  return useReaction(() => {
    const next = {
      filters: queryFilters,
      query: queryFilters.activeQuery,
      dateState: queryFilters.dateState,
      toggleFilterActive: queryFilters.toggleFilterActive,
      activeFilters: queryFilters.activeFilters,
      activeDateFilters: queryFilters.activeDateFilters,
    }
    if (!last.current || (appStore.isActive && !isEqual(last.current, next))) {
      last.current = next
      if (cb) {
        cb(next)
      } else {
        return next
      }
    }
  })
}
