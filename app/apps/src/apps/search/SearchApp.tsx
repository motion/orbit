import { App, AppDefinition, AppProps, useSearch } from '@mcro/kit'
import { useStore } from '@mcro/use-store'
import React, { createContext } from 'react'
import { SearchAppIndex } from './SearchAppIndex'
import { SearchAppMain } from './SearchAppMain'
import { SearchAppSettings } from './SearchAppSettings'
import { SearchStore } from './SearchStore'
import { SearchToolBar } from './SearchToolBar'

export const context = createContext({
  searchStore: null as SearchStore,
})

export const SearchApp: AppDefinition = {
  id: 'search',
  name: 'Search',
  icon: '',
  context,
  app: (props: AppProps) => {
    const searchStore = useStore(SearchStore)
    useSearch(state => {
      searchStore.setSearchState(state)
    })
    return (
      <App provideStores={{ searchStore }} index={<SearchAppIndex />} toolBar={<SearchToolBar />}>
        <SearchAppMain {...props} />
      </App>
    )
  },
  settings: SearchAppSettings,
}
