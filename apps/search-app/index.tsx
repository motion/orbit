import { App, AppFilterButton, AppMainView, AppViewProps, createApp, useSearchState, useStore, useStores, useUserState } from '@o/kit'
import { Button, Calendar, FloatingCard, List, Popover, Scale, Stack, View } from '@o/ui'
import React, { useMemo } from 'react'

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
  useSearchState({
    onChange: state => {
      searchStore.setSearchState(state)
    },
  })
  const listElement = (
    <List
      alwaysSelected
      shareable
      selectable
      query={searchStore.searchedQuery}
      itemProps={useMemo(
        () => ({
          iconBefore: true,
          iconSize: 42,
        }),
        [],
      )}
      items={searchStore.results}
    />
  )

  const actionsElement = useMemo(() => <SearchActions {...{ showFloating, setShowFloating }} />, [
    showFloating,
  ])

  if (showFloating) {
    return (
      <App actions={actionsElement}>
        <Scale size={1.1}>{listElement}</Scale>
        <FloatingCard
          defaultWidth={500}
          defaultHeight={350}
          attach="bottom right"
          bounds={{ top: 20, left: 20, right: 20, bottom: 20 }}
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
    <Stack direction="horizontal" space="sm">
      <Stack direction="horizontal" group>
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
      </Stack>

      <Stack direction="horizontal" group>
        <Button
          chromeless
          onClick={() => props.setShowFloating(!props.showFloating)}
          tooltip={`Toggle large view`}
          icon="zoom-to-fit"
          active={props.showFloating}
        />
      </Stack>
    </Stack>
  )
}
