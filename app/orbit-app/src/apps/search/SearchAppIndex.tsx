import { AppType } from '@mcro/models'
import { Popover, View } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { DateRangePicker } from 'react-date-range'
import OrbitFilterIntegrationButton from '../../components/OrbitFilterIntegrationButton'
import { OrbitToolbar } from '../../components/OrbitToolbar'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { FloatingBar } from '../../views/FloatingBar/FloatingBar'
import { FloatingButton } from '../../views/FloatingBar/FloatingButton'
import { Icon } from '../../views/Icon'
import SelectableList from '../../views/Lists/SelectableList'
import { AppProps } from '../AppProps'
import './calendar.css' // theme css file
import { SearchStore } from './SearchStore'
import OrbitSuggestionBar from './views/OrbitSuggestionBar'

export default observer(function SearchAppIndex(props: AppProps<AppType.search>) {
  const searchStore = useStore(SearchStore, props)
  const { queryStore } = useStoresSafe()
  const { queryFilters } = queryStore
  return (
    <>
      <OrbitToolbar>
        <OrbitSuggestionBar />
      </OrbitToolbar>

      {/* TODO api for handling suggestions */}
      {/* <OrbitSuggestions items={} /> */}

      <FloatingBar>
        <Popover
          delay={250}
          openOnClick
          openOnHover
          closeOnClickAway
          group="filters"
          target={<FloatingButton icon="calendar" />}
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
        <FloatingButton onClick={queryFilters.toggleSortBy} tooltip="Sort by">
          {queryFilters.sortBy}
        </FloatingButton>
        <View flex={1} />
        <OrbitFilterIntegrationButton />
      </FloatingBar>

      <SelectableList
        defaultSelected={0}
        // padTop={28}
        items={searchStore.searchState.results}
        query={props.appStore.activeQuery}
        rowCount={searchStore.remoteRowCount}
        loadMoreRows={searchStore.loadMore}
        getItemProps={index => {
          return {
            after: (
              <View
                alignItems="center"
                justifyContent="center"
                width={32}
                opacity={0.5}
                hoverStyle={{ opacity: 1 }}
              >
                <Icon name="dots" size={12} />
              </View>
            ),
          }
        }}
      />
    </>
  )
})
