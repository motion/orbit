import { AppProps, SourceFilterButton, useSearch } from '@mcro/kit'
import { BarButtonSmall, Calendar, HorizontalSpace, Popover, SegmentedRow, View } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import React from 'react'
import { useStores } from '../../hooks/useStores'
import { App } from '../../views/App'
import SearchAppIndex from './SearchAppIndex'
import SearchAppMain from './SearchAppMain'
import SearchAppSettings from './SearchAppSettings'
import { SearchStore } from './SearchStore'
import OrbitSuggestionBar from './views/OrbitSuggestionBar'

export function SearchApp(props: AppProps) {
  const searchStore = useStore(SearchStore)

  useSearch(state => {
    searchStore.setSearchState(state)
  })

  return (
    <App
      provideStores={{ searchStore }}
      index={<SearchAppIndex {...props} />}
      toolBar={<SearchToolBar />}
    >
      <SearchAppMain {...props} />
    </App>
  )
}

SearchApp.settings = SearchAppSettings

function SearchToolBar() {
  const { queryStore } = useStores()
  const { queryFilters } = queryStore

  return (
    <>
      <BarButtonSmall
        onClick={queryFilters.toggleSortBy}
        tooltip={`Sort by: ${queryFilters.sortBy}`}
        icon={queryFilters.sortBy === 'Relevant' ? 'shape-circle' : 'arrowup'}
      >
        {queryFilters.sortBy}
      </BarButtonSmall>

      <HorizontalSpace />

      <SegmentedRow justifyContent="center">
        <Popover
          openOnClick
          closeOnClickAway
          group="filters"
          target={<BarButtonSmall icon="ui-1_calendar-57" />}
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

        <SourceFilterButton />
      </SegmentedRow>

      <View flex={1} />
      <OrbitSuggestionBar />
    </>
  )
}
