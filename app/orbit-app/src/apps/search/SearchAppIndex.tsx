import { AppType } from '@mcro/models'
import { Absolute, Button, Popover, Row, View } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { DateRangePicker } from 'react-date-range'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import SelectableList from '../../views/Lists/SelectableList'
import { AppProps } from '../AppProps'
import './calendar.css' // theme css file
import { SearchStore } from './SearchStore'
import SearchFilters from './views/SearchFilters'

const ToolButton = props => (
  <Button
    borderWidth={0}
    sizeHeight={0.8}
    sizeIcon={1.45}
    fontWeight={500}
    size={0.95}
    sizeRadius={3}
    opacity={0.8}
    {...props}
  />
)

export default observer(function SearchAppIndex(props: AppProps<AppType.search>) {
  const searchStore = useStore(SearchStore, props)
  const { queryStore } = useStoresSafe()
  return (
    <>
      {/* <Toolbar>
        <OrbitSuggestionBar />
      </Toolbar> */}

      <Absolute top={8} right={16} left={16} zIndex={1000}>
        <Row>
          <Popover
            delay={250}
            openOnClick
            openOnHover
            closeOnClickAway
            group="filters"
            target={<ToolButton icon="calendar" />}
            background
            borderRadius={10}
            elevation={4}
            theme="light"
          >
            <View width={390} height={300} className="calendar-dom theme-light" padding={10}>
              <DateRangePicker
                onChange={queryStore.queryFilters.onChangeDate}
                ranges={[queryStore.queryFilters.dateState]}
              />
            </View>
          </Popover>
          <View width={4} />
          <ToolButton onClick={queryStore.queryFilters.toggleSortBy} tooltip="Sort by">
            {queryStore.queryFilters.sortBy}
          </ToolButton>
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
            target={<ToolButton icon="funnel">All</ToolButton>}
          >
            <SearchFilters />
          </Popover>
        </Row>
      </Absolute>

      <SelectableList
        defaultSelected={0}
        padTop={28}
        items={searchStore.searchState.results}
        query={props.appStore.activeQuery}
        onSelect={props.onSelectItem}
        onOpen={props.onOpenItem}
        rowCount={searchStore.remoteRowCount}
        loadMoreRows={searchStore.loadMore}
      />
    </>
  )
})
