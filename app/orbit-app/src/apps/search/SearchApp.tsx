import { HorizontalSpace, Popover, SegmentedRow, View } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import React from 'react'
import { DateRangePicker } from 'react-date-range'
import OrbitFilterIntegrationButton from '../../components/OrbitFilterIntegrationButton'
import { useSearch } from '../../hooks/useSearch'
import { useStores } from '../../hooks/useStores'
import { FloatingBarButtonSmall } from '../../views/FloatingBar/FloatingBarButtonSmall'
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
      <FloatingBarButtonSmall
        onClick={queryFilters.toggleSortBy}
        tooltip={`Sort by: ${queryFilters.sortBy}`}
        icon={queryFilters.sortBy === 'Relevant' ? 'shape-circle' : 'arrowup'}
      >
        {queryFilters.sortBy}
      </FloatingBarButtonSmall>

      <HorizontalSpace />

      <SegmentedRow justifyContent="center">
        <Popover
          openOnClick
          closeOnClickAway
          group="filters"
          target={<FloatingBarButtonSmall icon="ui-1_calendar-57" />}
          background
          borderRadius={10}
          elevation={4}
          themeName="light"
          width={420}
          height={310}
        >
          <View flex={1} className="calendar-dom theme-light" padding={10}>
            <DateRangePicker
              onChange={queryFilters.onChangeDate}
              ranges={[queryFilters.dateState]}
            />
          </View>
        </Popover>

        <OrbitFilterIntegrationButton />
      </SegmentedRow>

      <View flex={1} />
      <OrbitSuggestionBar />
    </>
  )
}
