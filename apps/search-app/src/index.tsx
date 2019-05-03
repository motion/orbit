import { App, AppFilterButton, AppMainView, AppProps, createApp, useSearchState, useStore, useStores } from '@o/kit'
import { Button, Calendar, Col, FloatingCard, List, Popover, useWindowSize, View } from '@o/ui'
import React from 'react'

import { ManageApps } from './ManageApps'
import { SearchAppSettings } from './SearchAppSettings'
import { SearchStore } from './SearchStore'

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

  const width = 300
  const height = 280

  return (
    <App actions={<SearchActions />}>
      <Col flex={1} pad="xxl">
        <List shareable selectable items={searchStore.results} />
      </Col>
      <FloatingCard
        defaultWidth={width}
        defaultHeight={height}
        usePosition={() => useWindowSize({ adjust: ([x, y]) => [x - width - 20, y - height - 20] })}
        visible
      >
        {props.subType === 'home' ? <ManageApps /> : <AppMainView {...props} />}
      </FloatingCard>
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
