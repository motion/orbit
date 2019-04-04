import {
  App,
  AppFilterButton,
  AppProps,
  createApp,
  useSearchState,
  useStore,
  useStores,
  View,
} from '@o/kit'
import { Button, Calendar, Popover } from '@o/ui'
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

  useSearchState(state => {
    searchStore.setSearchState(state)
  })

  return (
    <SearchContext.Provider value={{ searchStore }}>
      <App index={<SearchAppIndex />} toolBar={<SearchToolBar />} actions={<SearchActions />}>
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
  config: {
    transparentBackground: true,
  },
})

function SearchActions() {
  const { queryStore } = useStores()
  const { queryFilters } = queryStore

  return (
    <>
      <Button
        onClick={queryFilters.toggleSortBy}
        tooltip={`Sort by: ${queryFilters.sortBy}`}
        icon={queryFilters.sortBy === 'Relevant' ? 'shape-circle' : 'arrowup'}
      />
      <Popover
        openOnClick
        closeOnClickAway
        group="filters"
        target={<Button icon="ui-1_calendar-57" />}
        background
        borderRadius={10}
        elevation={4}
        themeName="light"
        width={420}
        height={310}
      >
        <View flex={1} className="calendar-dom theme-light" padding={10}>
          <Calendar onChange={queryFilters.onChangeDate} ranges={[queryFilters.dateState]} />
        </View>
      </Popover>

      <AppFilterButton />
    </>
  )
}
