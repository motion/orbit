import { isEqual } from '@mcro/fast-compare'
import { useReaction } from '@mcro/use-store'
import { useRef } from 'react'
import { useStores } from '../helpers/useStores'
import { QueryFilterStore } from '../stores/QueryFilterStore'

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
