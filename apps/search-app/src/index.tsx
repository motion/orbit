import { App, AppFilterButton, AppMainView, AppViewProps, createApp, useSearchState, useStore, useStores, useUserState } from '@o/kit'
import { Button, Calendar, FloatingCard, List, Popover, Row, Scale, View } from '@o/ui'
import React from 'react'

import { SearchStore } from './SearchStore'

export default createApp({
  id: 'search',
  name: 'Search',
  icon: 'search',
  app: SearchApp,
  iconColors: ['#386798', '#095647'],
  viewConfig: {
    transparentBackground: true,
  },
})

export function SearchApp(props: AppViewProps) {
  const [showFloating, setShowFloating] = useUserState('show-floating', false)
  const searchStore = useStore(SearchStore)

  useSearchState(state => {
    searchStore.setSearchState(state)
  })

  const width = 500
  const height = 350

  const listElement = (
    <List
      alwaysSelected
      shareable
      selectable
      itemProps={{
        iconBefore: true,
        iconSize: 42,
      }}
      items={searchStore.results}
    />
  )

  const actionsElement = <SearchActions {...{ showFloating, setShowFloating }} />

  if (showFloating) {
    return (
      <App actions={actionsElement}>
        <Scale size={1.1}>{listElement}</Scale>
        <FloatingCard
          defaultWidth={width}
          defaultHeight={height}
          attach="bottom right"
          edgePad={[20, 20]}
          elevation={6}
          visible
        >
          <AppMainView {...props} />
        </FloatingCard>
      </App>
    )
  }

  return (
    <App actions={actionsElement} index={listElement}>
      <AppMainView {...props} />
    </App>
  )
}

function SearchActions(props: { showFloating: boolean; setShowFloating: Function }) {
  const { queryStore } = useStores()
  const { queryFilters } = queryStore
  return (
    <Row space="sm">
      <Row group>
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
      </Row>

      <Row group>
        <Button
          onClick={() => props.setShowFloating(!props.showFloating)}
          tooltip={`Toggle large view`}
          icon="zoom-to-fit"
          active={props.showFloating}
        />
      </Row>
    </Row>
  )
}
