import { App, AppDefinition, AppProps, useSearch } from '@mcro/kit'
import { useStore } from '@mcro/use-store'
import React from 'react'
import { createContext } from 'vm'
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

export const app: AppDefinition = {
  context: createContext({
    searchStore: null as SearchStore,
  }),
  views: {
    app: SearchApp,
    settings: SearchAppSettings,
  },
}
