import { App, AppProps, createApp, useSearch } from '@mcro/kit'
import { useStore } from '@mcro/use-store'
import React from 'react'
import { SearchAppIndex } from './SearchAppIndex'
import { SearchAppMain } from './SearchAppMain'
import { SearchAppSettings } from './SearchAppSettings'
import { SearchStore } from './SearchStore'
import { SearchToolBar } from './SearchToolBar'

export const SearchApp = createApp({
  id: 'search',
  name: 'Search',
  icon: '',
  app: (props: AppProps) => {
    const searchStore = useStore(SearchStore)

    useSearch(state => {
      searchStore.setSearchState(state)
    })

    return (
      <App index={<SearchAppIndex searchStore={searchStore} />} toolBar={<SearchToolBar />}>
        <SearchAppMain {...props} />
      </App>
    )
  },
  settings: SearchAppSettings,
})
