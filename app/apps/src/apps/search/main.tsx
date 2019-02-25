import { App, AppDefinition, AppProps, useSearch } from '@mcro/kit'
import { useStore } from '@mcro/use-store'
import React, { createContext } from 'react'
import { SearchAppIndex } from './SearchAppIndex'
import { SearchAppMain } from './SearchAppMain'
import { SearchAppSettings } from './SearchAppSettings'
import { SearchStore } from './SearchStore'
import { SearchToolBar } from './SearchToolBar'

function SearchApp(props: AppProps) {
  const searchStore = useStore(SearchStore)
  useSearch(state => {
    searchStore.setSearchState(state)
  })
  return (
    <App provideStores={{ searchStore }} index={<SearchAppIndex />} toolBar={<SearchToolBar />}>
      <SearchAppMain {...props} />
    </App>
  )
}

export const context = createContext({
  searchStore: null as SearchStore,
})

export const id = 'search'

export const app: AppDefinition = {
  name: 'Search',
  icon: '',
  context,
  app: SearchApp,
  settings: SearchAppSettings,
}
