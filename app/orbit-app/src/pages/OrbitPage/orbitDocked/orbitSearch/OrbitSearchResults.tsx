import * as React from 'react'
import { view, attach } from '@mcro/black'
import { OrbitSearchQuickResults } from './OrbitSearchQuickResults'
import { PaneManagerStore } from '../../PaneManagerStore'
import { SearchStore } from '../../../../stores/SearchStore'
import { SelectionStore } from '../../../../stores/SelectionStore'
import { ItemResolverDecorationContext } from '../../../../helpers/contexts/ItemResolverDecorationContext'
import { OrbitSearchVirtualList } from './OrbitSearchVirtualList'
import { SubPaneStore } from '../../SubPaneStore'
import { StaticContainer } from '../../../../views/StaticContainer'
import { OrbitSearchNav } from './OrbitSearchNav'

type Props = {
  paneManagerStore?: PaneManagerStore
  searchStore?: SearchStore
  selectionStore?: SelectionStore
  subPaneStore?: SubPaneStore
  name?: string
}

const OrbitSearchResultsFrame = view({
  position: 'relative',
  transition: 'all ease 100ms',
  flex: 1,
})

// separate view to prevent a few renders...
const OrbitSearchResultsContents = view(({ searchStore, selectionStore }: Props) => {
  return (
    <>
      <OrbitSearchQuickResults searchStore={searchStore} selectionStore={selectionStore} />
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

@attach('searchStore', 'selectionStore', 'paneManagerStore')
@view
export class OrbitSearchResults extends React.Component<Props> {
  render() {
    const { searchStore, selectionStore, subPaneStore, name } = this.props
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
          <OrbitSearchResultsContents
            selectionStore={selectionStore}
            searchStore={searchStore}
            subPaneStore={subPaneStore}
            name={name}
          />
        </ItemResolverDecorationContext.Provider>
      </>
    )
  }
}
