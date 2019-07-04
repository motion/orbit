import { isEqual } from '@o/fast-compare'
import { useVisibilityStore } from '@o/ui'
import { useReaction } from '@o/use-store'
import { useRef } from 'react'

import { QueryStore } from '../stores'
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

const getSearchState = ({ queryFilters }: QueryStore): SearchState => {
  return {
    filters: queryFilters,
    query: queryFilters.activeQuery,
    dateState: queryFilters.dateState,
    toggleFilterActive: queryFilters.toggleFilterActive,
    activeFilters: queryFilters.activeFilters,
    activeDateFilters: queryFilters.activeDateFilters,
  }
}

export function useSearchState(cb?: (state: SearchState) => any) {
  const { queryStore } = useStoresSimple()
  const last = useRef(null)
  const visibilityStore = useVisibilityStore()
  return useReaction(
    () => {
      const next = getSearchState(queryStore)
      if (!last.current || (visibilityStore.visible && !isEqual(last.current, next))) {
        last.current = next
        if (cb) {
          cb(next)
        } else {
          return next
        }
      }
    },
    {
      name: 'useSearchState',
    },
  )
}
