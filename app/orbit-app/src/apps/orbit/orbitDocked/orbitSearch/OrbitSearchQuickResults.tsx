import * as React from 'react'
import { view, compose } from '@mcro/black'
import { OrbitCard } from '../../../../views/OrbitCard'
import * as UI from '@mcro/ui'
import { SearchStore } from '../../../../stores/SearchStore'
import { AppStore } from '../../../../stores/AppStore'
import { PaneManagerStore } from '../../PaneManagerStore'
import { SelectionStore } from '../../../../stores/SelectionStore'

const height = 100
const pad = 12
const scrollBarHeight = 16
const frameHeight = height + pad

const QuickResultsFrameHideScrollBar = view(UI.View, {
  overflow: 'hidden',
})

const QuickResultsFrame = view(UI.Row, {
  alignItems: 'center',
  height: frameHeight + scrollBarHeight + 3,
  paddingBottom: scrollBarHeight + pad,
  marginBottom: -(scrollBarHeight + pad),
  overflow: 'hidden',
  overflowX: 'auto',
})

const decorate = compose(
  view.attach('selectionStore'),
  view,
)

type Props = {
  appStore?: AppStore
  paneManagerStore?: PaneManagerStore
  searchStore: SearchStore
  selectionStore: SelectionStore
}

export const OrbitSearchQuickResults = decorate(
  ({ searchStore, selectionStore }: Props) => {
    const { results } = searchStore.quickSearchState
    return (
      <QuickResultsFrameHideScrollBar height={results.length ? frameHeight : 0}>
        <QuickResultsFrame>
          {/* inner div so scrolls to end all the way */}
          <div style={{ flexFlow: 'row', padding: pad }}>
            {results.map(item => {
              return (
                <OrbitCard
                  preventAutoSelect
                  pane="docked-search"
                  subPane="search"
                  className="quick-result-card"
                  key={item.id}
                  bit={item}
                  getIndex={selectionStore.getIndexForItem}
                  inGrid
                  style={{
                    width: 240,
                    height: height - 20, // 20 == shadow space
                    marginRight: 10,
                  }}
                  cardProps={{
                    flex: 1,
                  }}
                  hide={{
                    icon: true,
                  }}
                />
              )
            })}
          </div>
        </QuickResultsFrame>
      </QuickResultsFrameHideScrollBar>
    )
  },
)
