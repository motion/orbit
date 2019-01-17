import * as React from 'react'
import { SearchStore } from './SearchStore'
import SearchNav from './views/SearchNav'
import { AppProps } from '../AppProps'
import { useStore } from '@mcro/use-store'
import { Toolbar } from '../../components/Toolbar'
import { observer } from 'mobx-react-lite'
import { AppType } from '@mcro/models'
import SelectableList from '../../views/Lists/SelectableList'

export default observer(function SearchAppIndex(props: AppProps<AppType.search>) {
  const searchStore = useStore(SearchStore, props)
  return (
    <>
      <Toolbar>
        <SearchNav />
      </Toolbar>
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
