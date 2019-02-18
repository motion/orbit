import isEqual from '@mcro/fast-compare'
import { autorun } from 'mobx'
import { useDisposable } from 'mobx-react-lite'
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

  useDisposable(
    () =>
      autorun(() => {
        if (appStore.isActive) {
          const next = {
            query: queryStore.queryFilters.activeQuery,
            queryFilters: queryStore.queryFilters,
          }
          if (isEqual(last.current, next)) return
          last.current = next
          cb(next)
        }
      }),
    [],
  )
}
