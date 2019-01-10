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
import { Selectable } from '../../components/Selectable'

export const SearchAppIndex = observer((props: AppProps<'search'>) => {
  const searchStore = useStore(SearchStore, props)
  const shouldHideNav = props.itemProps && props.itemProps.hide && props.itemProps.hide.subtitle

  return (
    <MergeContext Context={StoreContext} value={{ searchStore }}>
      {!shouldHideNav && (
        <Toolbar>
          <SearchNav />
        </Toolbar>
      )}
      <View position="relative" flex={1} opacity={searchStore.isChanging ? 0.7 : 1}>
        <Selectable items={searchStore.searchState.results}>
          <SearchResultsList
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
