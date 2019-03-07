import { App, AppProps, createApp, useSearch } from '@o/kit'
import { useStore } from '@o/use-store'
import React, { createContext } from 'react'
import { SearchAppIndex } from './SearchAppIndex'
import { SearchAppMain } from './SearchAppMain'
import { SearchAppSettings } from './SearchAppSettings'
import { SearchStore } from './SearchStore'
import { SearchToolBar } from './SearchToolBar'

export const SearchContext = createContext({
  searchStore: null as SearchStore,
})

function SearchApp(props: AppProps) {
  const searchStore = useStore(SearchStore)

  useSearch(state => {
    searchStore.setSearchState(state)
  })

  return (
    <SearchContext.Provider value={{ searchStore }}>
      <App index={<SearchAppIndex />} toolBar={<SearchToolBar />}>
        <SearchAppMain {...props} />
      </App>
    </SearchContext.Provider>
  )
}

export default createApp({
  id: 'search',
  name: 'Search',
  icon: '',
  app: SearchApp,
  settings: SearchAppSettings,
})
