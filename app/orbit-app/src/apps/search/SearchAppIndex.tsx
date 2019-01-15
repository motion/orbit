import * as React from 'react'
import { SearchStore } from './SearchStore'
import SearchNav from './views/SearchNav'
import { AppProps } from '../AppProps'
import { useStore } from '@mcro/use-store'
import { Toolbar } from '../../components/Toolbar'
import { observer } from 'mobx-react-lite'
import { View } from '@mcro/ui'
import { OrbitList } from '../../views/Lists/OrbitList'
import { MergeContext } from '../../views/MergeContext'
import { Selectable } from '../../components/Selectable'
import { AppType } from '@mcro/models'
import { StoreContext } from '../../contexts'

export default observer(function SearchAppIndex(props: AppProps<AppType.search>) {
  const searchStore = useStore(SearchStore, props)
  return (
    <MergeContext Context={StoreContext} value={{ searchStore }}>
      <Toolbar>
        <SearchNav />
      </Toolbar>
      <View position="relative" flex={1} opacity={searchStore.isChanging ? 0.7 : 1}>
        <Selectable items={searchStore.searchState.results}>
          <OrbitList
            items={searchStore.searchState.results}
            query={props.appStore.activeQuery}
            onSelect={props.onSelectItem}
            onOpen={props.onOpenItem}
            rowCount={searchStore.remoteRowCount}
            loadMoreRows={searchStore.loadMore}
          />
        </Selectable>
      </View>
    </MergeContext>
  )
})
