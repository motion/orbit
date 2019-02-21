import { useReaction } from '@mcro/black'
import { isEqual } from '@mcro/fast-compare'
import { useRef } from 'react'
import { QueryFilterStore } from '../stores/QueryStore/QueryFiltersStore'
import { useStores } from './useStores'

export type SearchState = {
  query: string
  queryFilters: QueryFilterStore
}

export function useSearch(cb: (state: SearchState) => any) {
  const { appStore, queryStore } = useStores()
  const last = useRef(null)

  useReaction(() => {
    const next = {
      query: queryStore.queryFilters.activeQuery,
      queryFilters: queryStore.queryFilters,
    }
    if (!last.current || (appStore.isActive && !isEqual(last.current, next))) {
      last.current = next
      cb(next)
    }
  })
}
