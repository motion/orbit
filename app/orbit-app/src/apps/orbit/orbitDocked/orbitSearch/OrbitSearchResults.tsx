import * as React from 'react'
import { view, compose } from '@mcro/black'
import { SubPane } from '../../SubPane'
import { OrbitSearchQuickResults } from './OrbitSearchQuickResults'
import { PaneManagerStore } from '../../PaneManagerStore'
import { SearchStore } from '../SearchStore'
import { SelectionStore } from '../SelectionStore'
import { OrbitNavVerticalPad } from '../../../../views'
import { ItemResolverDecorationContext } from '../../../../helpers/contexts/ItemResolverDecorationContext'
import { OrbitSearchVirtualList } from './OrbitSearchVirtualList'
import { SubPaneStore } from '../../SubPaneStore'

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
const decorator = compose(
  view.attach('subPaneStore'),
  view,
)
const OrbitSearchResultsContents = decorator(
  ({ searchStore, selectionStore, subPaneStore }: Props) => {
    const { isChanging } = searchStore
    return (
      <>
        <OrbitSearchQuickResults searchStore={searchStore} selectionStore={selectionStore} />
        <OrbitSearchResultsFrame
          style={{
            opacity: isChanging ? 0.7 : 1,
          }}
        >
          <OrbitSearchVirtualList
            key={searchStore.searchState.query}
            scrollingElement={subPaneStore.paneNode}
          />
        </OrbitSearchResultsFrame>
      </>
    )
  },
)

@view.attach('searchStore', 'selectionStore', 'paneManagerStore')
@view
export class OrbitSearchResults extends React.Component<Props> {
  render() {
    const { searchStore, selectionStore, subPaneStore, name } = this.props
    return (
      <SubPane
        transition="none"
        paddingLeft={0}
        paddingRight={0}
        name="search"
        extraCondition={this.props.searchStore.hasQuery}
        before={<OrbitNavVerticalPad />}
        preventScroll
      >
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
      </SubPane>
    )
  }
}
