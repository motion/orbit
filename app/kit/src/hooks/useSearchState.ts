import { isEqual } from '@o/fast-compare'
import { useReaction } from '@o/use-store'
import { useRef } from 'react'
import { QueryFilterStore } from '../stores/QueryFilterStore'
import { useStores } from './useStores'

export type SearchState = {
  query: string
  queryFilters: QueryFilterStore
}

export function useSearchState(cb?: (state: SearchState) => any) {
  const { appStore, queryStore } = useStores()
  const last = useRef(null)
  return useReaction(() => {
    const next = {
      query: queryStore.queryFilters.activeQuery,
      queryFilters: queryStore.queryFilters,
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
