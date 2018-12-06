import * as React from 'react'
import { SearchStore } from './SearchStore'
import { OrbitSearchNav } from './views/OrbitSearchNav'
import { AppProps } from '../AppProps'
import { useStore } from '@mcro/use-store'
import { Toolbar } from '../../components/Toolbar'
import { observer } from 'mobx-react-lite'
import { View } from '@mcro/ui'
import { SearchResultsList } from '../../views/Lists/SearchResultsList'
import { MergeContext } from '../../views/MergeContext'
import { StoreContext } from '@mcro/black'
import { GetItemProps } from '../../views/VirtualList/VirtualList'

export const SearchAppIndex = observer((props: AppProps) => {
  const searchStore = useStore(SearchStore, props)
  const shouldHideNav = props.itemProps && props.itemProps.hide && props.itemProps.hide.subtitle
  const results = searchStore.resultsForVirtualList

  const getItemProps: GetItemProps = index => {
    const model = results[index]
    if (index === 0 || model.group !== results[index - 1].group) {
      let separator: string
      if (model.group === 'last-day' || !model.group) {
        separator = 'Last Day'
      } else if (model.group === 'last-week') {
        separator = 'Last Week'
      } else if (model.group === 'last-month') {
        separator = 'Last Month'
      } else {
        separator = 'All Period'
      }
      return { separator }
    }
    return {}
  }

  return (
    <MergeContext Context={StoreContext} value={{ searchStore }}>
      {!shouldHideNav && (
        <Toolbar>
          <OrbitSearchNav />
        </Toolbar>
      )}
      <View position="relative" flex={1} opacity={searchStore.isChanging ? 0.7 : 1}>
        <SearchResultsList
          results={results}
          query={searchStore.activeQuery}
          getItemProps={getItemProps}
          itemProps={props.itemProps}
          rowCount={searchStore.remoteRowCount}
          loadMoreRows={searchStore.loadMore}
        />
      </View>
    </MergeContext>
  )
})
