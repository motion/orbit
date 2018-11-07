import * as React from 'react'
import { view } from '@mcro/black'
import { SearchStore } from './SearchStore'
import { ItemResolverDecorationContext } from '../../helpers/contexts/ItemResolverDecorationContext'
import { OrbitSearchResults } from './views/OrbitSearchResults'
import { OrbitSearchNav } from './views/OrbitSearchNav'
import { AppProps } from '../AppProps'
import { useStore } from '@mcro/use-store'
import { StaticContainer } from '../../views/StaticContainer'

export function SearchAppIndex(props: AppProps) {
  const searchStore = useStore(SearchStore, props, true)
  log(`SEARCH--------`)
  return (
    <>
      <OrbitSearchNav />
      <ItemResolverDecorationContext.Provider
        value={{
          item: null,
          text: {
            alpha: 0.6555,
          },
        }}
      >
        {/* <OrbitSearchQuickResults /> */}
        <OrbitSearchResultsFrame
          style={{
            opacity: searchStore.isChanging ? 0.7 : 1,
          }}
        >
          <StaticContainer>
            <SearchAppInner searchStore={searchStore} {...props} />
          </StaticContainer>
        </OrbitSearchResultsFrame>
      </ItemResolverDecorationContext.Provider>
    </>
  )
}

const SearchAppInner = React.memo((props: AppProps & { searchStore: SearchStore }) => {
  log('--------------renderererererere-----------------')
  return (
    <OrbitSearchResults searchStore={props.searchStore} appStore={props.appStore} offsetY={60} />
  )
})

const OrbitSearchResultsFrame = view({
  position: 'relative',
  transition: 'all ease 100ms',
  flex: 1,
})
