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

export const SearchAppIndex = observer((props: AppProps) => {
  const searchStore = useStore(SearchStore, props)
  const shouldHideNav = props.itemProps && props.itemProps.hide && props.itemProps.hide.subtitle
  return (
    <MergeContext Context={StoreContext} value={{ searchStore }}>
      {!shouldHideNav && (
        <Toolbar>
          <OrbitSearchNav />
        </Toolbar>
      )}
      <View position="relative" flex={1} opacity={searchStore.isChanging ? 0.7 : 1}>
        <SearchResultsList
          results={searchStore.resultsForVirtualList}
          query={searchStore.activeQuery}
        />
      </View>
    </MergeContext>
  )
})
