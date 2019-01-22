import { AppType } from '@mcro/models'
import { Popover, View } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { DateRangePicker } from 'react-date-range'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { ControlButton } from '../../views/ControlButtons'
import SelectableList from '../../views/Lists/SelectableList'
import { TopControls } from '../../views/TopControls'
import { AppProps } from '../AppProps'
import './calendar.css' // theme css file
import { SearchStore } from './SearchStore'
import SearchFilters from './views/SearchFilters'

export default observer(function SearchAppIndex(props: AppProps<AppType.search>) {
  const searchStore = useStore(SearchStore, props)
  const { queryStore } = useStoresSafe()
  const { queryFilters } = queryStore
  console.log('rendering SearchAppIndex...', props)
  return (
    <>
      {/* <Toolbar>
        <OrbitSuggestionBar />
      </Toolbar> */}

      <TopControls>
        <Popover
          delay={250}
          openOnClick
          openOnHover
          closeOnClickAway
          group="filters"
          target={<ControlButton icon="calendar" />}
          background
          borderRadius={10}
          elevation={4}
          theme="light"
        >
          <View width={390} height={300} className="calendar-dom theme-light" padding={10}>
            <DateRangePicker
              onChange={queryFilters.onChangeDate}
              ranges={[queryFilters.dateState]}
            />
          </View>
        </Popover>
        <View width={4} />
        <ControlButton onClick={queryFilters.toggleSortBy} tooltip="Sort by">
          {queryFilters.sortBy}
        </ControlButton>
        <View flex={1} />
        <Popover
          delay={250}
          openOnClick
          openOnHover
          closeOnClickAway
          group="filters"
          background
          borderRadius={6}
          elevation={4}
          theme="light"
          target={
            <ControlButton icon="funnel">
              {queryFilters.hasIntegrationFilters
                ? queryFilters.integrationFilters.filter(x => x.active).length
                : 'All'}
            </ControlButton>
          }
        >
          <SearchFilters />
        </Popover>
      </TopControls>

      <SelectableList
        defaultSelected={0}
        padTop={28}
        items={searchStore.searchState.results}
        query={props.appStore.activeQuery}
        rowCount={searchStore.remoteRowCount}
        loadMoreRows={searchStore.loadMore}
      />
    </>
  )
})
