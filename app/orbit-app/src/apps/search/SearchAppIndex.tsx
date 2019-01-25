import { AppType } from '@mcro/models'
import { App } from '@mcro/stores'
import { Popover, View } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { DateRangePicker } from 'react-date-range'
import OrbitFilterIntegrationButton from '../../components/OrbitFilterIntegrationButton'
import { OrbitToolbar } from '../../components/OrbitToolbar'
import { preventDefault } from '../../helpers/preventDefault'
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
  const items = searchStore.searchState.results
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
        minSelected={0}
        items={items}
        query={props.appStore.activeQuery}
        rowCount={searchStore.remoteRowCount}
        loadMoreRows={searchStore.loadMore}
        getItemProps={index => {
          const item = items[index]
          if (item.item && item.item.target) {
            return {
              after: (
                <Popover
                  // selected would otherwise override this theme
                  theme={App.state.darkTheme ? 'dark' : 'light'}
                  width={250}
                  height={300}
                  target={
                    <View
                      alignItems="center"
                      justifyContent="center"
                      width={34}
                      opacity={0.5}
                      hoverStyle={{ opacity: 1 }}
                      onClick={preventDefault(() => console.log('show popover'))}
                    >
                      <Icon name="dots" size={12} />
                    </View>
                  }
                  openOnClick
                  closeOnClickAway
                  group="filters"
                  background
                  borderRadius={10}
                  elevation={2}
                >
                  {isShown => (
                    <View flex={1} className="calendar-dom theme-light" padding={10}>
                      {isShown ? 'show' : 'hide'}
                    </View>
                  )}
                </Popover>
              ),
            }
          }
          return null
        }}
      />
    </>
  )
})
