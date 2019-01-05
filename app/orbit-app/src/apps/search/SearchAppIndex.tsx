import * as React from 'react'
import { SearchStore } from './SearchStore'
import { SearchNav } from './views/SearchNav'
import { AppProps } from '../AppProps'
import { useStore } from '@mcro/use-store'
import { Toolbar } from '../../components/Toolbar'
import { observer } from 'mobx-react-lite'
import { View } from '@mcro/ui'
import { SearchResultsList } from '../../views/Lists/SearchResultsList'
import { MergeContext } from '../../views/MergeContext'
import { StoreContext } from '@mcro/black'

export const SearchAppIndex = observer((props: AppProps<'search'>) => {
  const searchStore = useStore(SearchStore, props)
  const shouldHideNav = props.itemProps && props.itemProps.hide && props.itemProps.hide.subtitle
  const results = searchStore.resultsForVirtualList

  return (
    <MergeContext Context={StoreContext} value={{ searchStore }}>
      {!shouldHideNav && (
        <Toolbar>
          <SearchNav />
        </Toolbar>
      )}
      <View position="relative" flex={1} opacity={searchStore.isChanging ? 0.7 : 1}>
        <SearchResultsList
          results={results}
          query={props.appStore.activeQuery}
          itemProps={props.itemProps}
          rowCount={searchStore.remoteRowCount}
          loadMoreRows={searchStore.loadMore}
        />
      </View>
    </MergeContext>
  )
})
