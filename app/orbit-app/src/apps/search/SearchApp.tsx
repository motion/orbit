import * as React from 'react'
import { view } from '@mcro/black'
import { SearchStore } from './SearchStore'
import { ItemResolverDecorationContext } from '../../helpers/contexts/ItemResolverDecorationContext'
import { StaticContainer } from '../../views/StaticContainer'
import { OrbitSearchVirtualList } from './OrbitSearchVirtualList'
import { OrbitSearchNav } from './OrbitSearchNav'
import { AppProps } from '../AppProps'
import { useStore } from '@mcro/use-store'

export function SearchApp(props: AppProps) {
  const searchStore = useStore(SearchStore, props)
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
        <SearchAppFrame searchStore={searchStore} />
      </ItemResolverDecorationContext.Provider>
    </>
  )
}

// separate view to prevent a few renders...
const SearchAppFrame = view(({ searchStore }: AppProps & { searchStore: SearchStore }) => {
  return (
    <>
      {/* <OrbitSearchQuickResults /> */}
      <OrbitSearchResultsFrame
        style={{
          opacity: searchStore.isChanging ? 0.7 : 1,
        }}
      >
        <StaticContainer>
          <OrbitSearchVirtualList searchStore={searchStore} offsetY={60} />
        </StaticContainer>
      </OrbitSearchResultsFrame>
    </>
  )
})

const OrbitSearchResultsFrame = view({
  position: 'relative',
  transition: 'all ease 100ms',
  flex: 1,
})
