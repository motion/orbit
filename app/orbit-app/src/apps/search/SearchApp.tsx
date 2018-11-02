import * as React from 'react'
import { view, attach, provide } from '@mcro/black'
import { SearchStore } from './SearchStore'
import { ItemResolverDecorationContext } from '../../helpers/contexts/ItemResolverDecorationContext'
import { StaticContainer } from '../../views/StaticContainer'
// import { OrbitSearchQuickResults } from './OrbitSearchQuickResults'
import { OrbitSearchVirtualList } from './OrbitSearchVirtualList'
import { OrbitSearchNav } from './OrbitSearchNav'
import { AppProps } from '../types'

type Props = AppProps & {
  searchStore?: SearchStore
}

@attach('queryStore', 'paneManagerStore')
@provide({
  searchStore: SearchStore,
})
@view
export class SearchApp extends React.Component<Props> {
  render() {
    const { searchStore } = this.props
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
}

// separate view to prevent a few renders...
const SearchAppFrame = view(({ searchStore }: Props) => {
  return (
    <>
      {/* <OrbitSearchQuickResults /> */}
      <OrbitSearchResultsFrame
        style={{
          opacity: searchStore.isChanging ? 0.7 : 1,
        }}
      >
        <StaticContainer>
          <OrbitSearchVirtualList />
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
