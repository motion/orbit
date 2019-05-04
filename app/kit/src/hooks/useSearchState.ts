import { isEqual } from '@o/fast-compare'
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
  const { appStore, queryStore } = useStoresSimple()
  const last = useRef(null)

  // TODO Michel mrwest debug this https://github.com/mobxjs/mobx/issues/1911
  return (
    useReaction(() => {
      const next = getSearchState(queryStore)
      if (!last.current || (appStore.isActive && !isEqual(last.current, next))) {
        last.current = next
        if (cb) {
          cb(next)
        } else {
          return next
        }
      }
    }) || getSearchState(queryStore)
  )
}
