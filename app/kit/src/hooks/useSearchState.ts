import { useGetVisibility } from '@o/ui'
import { ensure, useReaction } from '@o/use-store'

import { QueryStore } from '../stores'
import { QueryFilterStore } from '../stores/QueryFilterStore'
import { useStoresSimple } from './useStores'

export type SearchState = {
  query: string
  /** Query without filters */
  queryFull: string
  filters: QueryFilterStore
  dateState: QueryFilterStore['dateState']
  toggleFilterActive: QueryFilterStore['toggleFilterActive']
  activeFilters: QueryFilterStore['activeFilters']
  activeDateFilters: QueryFilterStore['activeDateFilters']
  setQuery: QueryStore['setQuery']
  clearQuery: QueryStore['clearQuery']
}

const getSearchState = (queryStore: QueryStore, includePrefix: boolean = false): SearchState => {
  const { queryFilters } = queryStore
  return {
    // state
    filters: queryFilters,
    query: includePrefix ? queryFilters.activeQuery : queryStore.queryWithoutPrefix,
    queryFull: queryStore.queryFull,
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
  includePrefix,
}: {
  onChange?: (state: SearchState) => any
  onEvent?: 'keypress' | 'enter'
  includePrefix?: boolean
} = {}) {
  const { queryStore } = useStoresSimple()
  const getVis = useGetVisibility()

  return useReaction(
    () => {
      if (onEvent === 'enter') {
        return queryStore!.lastCommand.at
      } else {
        return getSearchState(queryStore!, includePrefix)
      }
    },
    (status, { state }) => {
      ensure('not invisible, after resolved once', !state.hasResolvedOnce || getVis())
      if (onEvent === 'enter') {
        ensure('last command', queryStore!.lastCommand.name === 'enter')
      }
      const update = (next: SearchState = getSearchState(queryStore!, includePrefix)) => {
        if (onChange) {
          onChange(next)
        } else {
          return next
        }
      }
      return typeof status === 'number' ? update() : update(status)
    },
    {
      name: 'useSearchState',
    },
    [includePrefix, onEvent],
  )
}

export function useActiveSearch() {
  const state = useSearchState()
  return state ? state.query : ''
}
