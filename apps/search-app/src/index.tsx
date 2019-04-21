import { App, AppFilterButton, AppMainView, AppProps, createApp, useSearchState, useStore, useStores } from '@o/kit'
import { Button, Calendar, List, Popover, View } from '@o/ui'
import React from 'react'

import { ManageApps } from './ManageApps'
import { SearchAppSettings } from './SearchAppSettings'
import { SearchStore } from './SearchStore'
import { SearchSuggestionBar } from './SearchSuggestionBar'

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

function SearchApp(props: AppProps) {
  const searchStore = useStore(SearchStore)

  useSearchState(state => {
    searchStore.setSearchState(state)
  })

  return (
    <App
      index={<List shareable items={searchStore.results} />}
      toolBar={<SearchSuggestionBar />}
      actions={<SearchActions />}
    >
      {props.subType === 'home' ? <ManageApps /> : <AppMainView {...props} />}
    </App>
  )
}

function SearchActions() {
  const { queryStore } = useStores()
  const { queryFilters } = queryStore

  return (
    <>
      <Button
        onClick={queryFilters.toggleSortBy}
        tooltip={`Sort by: ${queryFilters.sortBy}`}
        icon={queryFilters.sortBy === 'Relevant' ? 'flame' : 'time'}
      />
      <Popover
        openOnClick
        closeOnClickAway
        target={<Button tooltip="Filter by date" icon="calendar" />}
        background
        borderRadius={10}
        elevation={4}
        popoverTheme="light"
        width={420}
        height={310}
      >
        <View
          background={theme => theme.background}
          flex={1}
          className="calendar-dom theme-light"
          padding={10}
        >
          <Calendar onChange={queryFilters.onChangeDate} ranges={[queryFilters.dateState]} />
        </View>
      </Popover>

      <AppFilterButton />
    </>
  )
}
