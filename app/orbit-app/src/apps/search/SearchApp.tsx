import { View } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import React from 'react'
import { useSearch } from '../../hooks/useSearch'
import { useStores } from '../../hooks/useStores'
import { FloatingBarButton } from '../../views/FloatingBar/FloatingBarButton'
import { AppContainer } from '../AppContainer'
import { AppProps } from '../AppTypes'
import SearchAppIndex from './SearchAppIndex'
import SearchAppMain from './SearchAppMain'
import { SearchStore } from './SearchStore'
import OrbitSuggestionBar from './views/OrbitSuggestionBar'

export function SearchApp(props: AppProps) {
  const searchStore = useStore(SearchStore)

  useSearch(state => {
    searchStore.setSearchState(state)
  })

  return (
    <AppContainer
      provideStores={{ searchStore }}
      index={<SearchAppIndex {...props} />}
      toolBar={<SearchToolBar />}
    >
      <SearchAppMain {...props} />
    </AppContainer>
  )
}

function SearchToolBar() {
  const { queryStore } = useStores()
  const { queryFilters } = queryStore

  return (
    <>
      <FloatingBarButton
        size={0.9}
        onClick={queryFilters.toggleSortBy}
        tooltip={`Sort by: ${queryFilters.sortBy}`}
        icon={queryFilters.sortBy === 'Relevant' ? 'shape-circle' : 'arrowup'}
      >
        {queryFilters.sortBy}
      </FloatingBarButton>
      <View flex={1} />
      <OrbitSuggestionBar />
    </>
  )
}
