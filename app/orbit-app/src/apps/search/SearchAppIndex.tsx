import { AppType } from '@mcro/models'
import { Absolute, Button, Popover } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { Toolbar } from '../../components/Toolbar'
import SelectableList from '../../views/Lists/SelectableList'
import { AppProps } from '../AppProps'
import { SearchStore } from './SearchStore'
import SearchFilters from './views/SearchFilters'
import SearchNav from './views/SearchNav'

export default observer(function SearchAppIndex(props: AppProps<AppType.search>) {
  const searchStore = useStore(SearchStore, props)
  return (
    <>
      <Toolbar>
        <SearchNav />
      </Toolbar>
      <Absolute top={8} right={8} zIndex={1000}>
        <Popover
          delay={100}
          openOnClick
          openOnHover
          closeOnClickAway
          group="filters"
          background
          borderRadius={6}
          elevation={4}
          theme="light"
          target={
            <Button borderWidth={0} sizeHeight={0.8} icon="funnel" size={0.8} sizeRadius={3}>
              All
            </Button>
          }
        >
          <SearchFilters />
        </Popover>
      </Absolute>
      {/* <Icon name="funnel" size={10} opacity={0.65} color="#999" marginRight={10} /> */}
      {/*  */}
      <SelectableList
        defaultSelected={0}
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
