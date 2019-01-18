import { AppType } from '@mcro/models'
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
