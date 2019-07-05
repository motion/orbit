import { useVisibilityStore } from '@o/ui'
import { cancel, useReaction } from '@o/use-store'

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
  setQuery: QueryStore['setQuery']
  clearQuery: QueryStore['clearQuery']
}

const getSearchState = (queryStore: QueryStore): SearchState => {
  const { queryFilters } = queryStore
  return {
    // state
    filters: queryFilters,
    query: queryFilters.activeQuery,
    dateState: queryFilters.dateState,
    toggleFilterActive: queryFilters.toggleFilterActive,
    activeFilters: queryFilters.activeFilters,
    activeDateFilters: queryFilters.activeDateFilters,
    // actions
    setQuery: queryStore.setQuery,
    clearQuery: queryStore.clearQuery,
  }
}

/**
 * Returns a description of the search state in the header searchbar
 * Can request of it on key 'enter' or on every keystroke with 'keypress'
 * If you pass onChange it won't return the value
 */
export function useSearchState({
  onChange,
  onEvent = 'keypress',
}: {
  onChange?: (state: SearchState) => any
  onEvent?: 'keypress' | 'enter'
} = {}) {
  const { queryStore } = useStoresSimple()
  const visibilityStore = useVisibilityStore()
  return useReaction(
    () => {
      if (!visibilityStore.visible) {
        return false
      }
      if (onEvent === 'enter') {
        return queryStore.lastCommand.at
      } else {
        return getSearchState(queryStore)
      }
    },
    (status, { getValue }) => {
      const update = (next: SearchState = getSearchState(queryStore)) => {
        if (onChange) {
          onChange(next)
        } else {
          return next
        }
      }
      if (status === false) {
        if (!getValue() && !onChange) {
          return update()
        }
        throw cancel
      }
      if (typeof status === 'number') {
        return update()
      }
      return update(status)
    },
    {
      name: 'useSearchState',
    },
  )
}
