import { AppFilterButton, useStores } from '@o/kit'
import { BarButtonSmall, Calendar, HorizontalSpace, Popover, SegmentedRow, View } from '@o/ui'
import React from 'react'
import { SearchSuggestionBar } from './SearchSuggestionBar'

export function SearchToolBar() {
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

        <AppFilterButton />
      </SegmentedRow>
      <View flex={1} />
      <SearchSuggestionBar />
    </>
  )
}
