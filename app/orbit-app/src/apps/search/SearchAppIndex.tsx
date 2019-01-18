import { AppType } from '@mcro/models'
import { Absolute, Button } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { Toolbar } from '../../components/Toolbar'
import SelectableList from '../../views/Lists/SelectableList'
import { AppProps } from '../AppProps'
import { SearchStore } from './SearchStore'
import SearchNav from './views/SearchNav'

export default observer(function SearchAppIndex(props: AppProps<AppType.search>) {
  const searchStore = useStore(SearchStore, props)
  return (
    <>
      <Toolbar>
        <SearchNav />
      </Toolbar>
      <Absolute top={8} right={8}>
        <Button icon="funnel" size={0.8} sizeRadius={3}>
          All
        </Button>
      </Absolute>
      {/* <Icon name="funnel" size={10} opacity={0.65} color="#999" marginRight={10} /> */}
      {/* <SearchFilters /> */}
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
