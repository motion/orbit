import { View } from '@mcro/ui'
import React from 'react'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { FloatingBarButton } from '../../views/FloatingBar/FloatingBarButton'
import { App } from '../App'
import { AppProps } from '../AppTypes'
import SearchAppIndex from './SearchAppIndex'
import SearchAppMain from './SearchAppMain'
import OrbitSuggestionBar from './views/OrbitSuggestionBar'

export function SearchApp(props: AppProps) {
  return (
    <App index={<SearchAppIndex {...props} />} toolBar={<SearchToolBar />}>
      <SearchAppMain {...props} />
    </App>
  )
}

function SearchToolBar() {
  const { queryStore } = useStoresSafe()
  const { queryFilters } = queryStore

  return (
    <>
      <FloatingBarButton
        size={0.9}
        onClick={queryFilters.toggleSortBy}
        tooltip={`Sort by: ${queryFilters.sortBy}`}
        icon={queryFilters.sortBy === 'Relevant' ? 'shape-circle' : 'arrowup'}
      >
        Sort
      </FloatingBarButton>
      <View flex={1} />
      <OrbitSuggestionBar />
    </>
  )
}
