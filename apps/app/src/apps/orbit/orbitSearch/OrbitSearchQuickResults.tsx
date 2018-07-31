import * as React from 'react'
import { view, react, compose, on } from '@mcro/black'
import { App } from '@mcro/stores'
import { OrbitCard } from '../../../views/OrbitCard'
import * as UI from '@mcro/ui'
import { SearchStore } from '../../../stores/SearchStore'
import { AppStore } from '../../../stores/AppStore'
import { PaneManagerStore } from '../PaneManagerStore'

class QuickSearchStore {
  props: {
    searchStore: SearchStore
  }

  frameRef = React.createRef<HTMLDivElement>()

  willMount() {
    on(this, this.searchStore, 'key', val => {
      if (val === 'enter') {
        App.actions.selectItem(
          this.quickResults[this.index],
          this.cardRefs[this.index],
        )
      }
    })
  }

  get searchStore() {
    return this.props.searchStore
  }

  get quickResults() {
    return this.searchStore.quickSearchState.results
  }

  get index() {
    return this.searchStore.quickIndex
  }

  get isChanging() {
    return App.state.query !== this.searchStore.quickSearchState.query
  }

  get cardRefs(): HTMLDivElement[] {
    return Array.from(
      this.frameRef.current.querySelectorAll('.quick-result-card'),
    )
  }

  scrollToSelected = react(
    () => this.index,
    index => {
      const frame = this.frameRef.current
      if (!frame) {
        throw react.cancel
      }
      const activeCard = this.cardRefs[index]
      frame.scrollLeft = activeCard.offsetLeft - 12
    },
  )
}

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
  view.attach({
    store: QuickSearchStore,
  }),
  view,
)

type Props = {
  appStore?: AppStore
  paneStore?: PaneManagerStore
  searchStore: SearchStore
  store: QuickSearchStore
}

export const OrbitSearchQuickResults = decorate(
  ({ searchStore, store }: Props) => {
    const { results } = searchStore.quickSearchState
    return (
      <QuickResultsFrameHideScrollBar height={results.length ? frameHeight : 0}>
        <QuickResultsFrame
          opacity={store.isChanging ? 0.5 : 1}
          forwardRef={store.frameRef}
        >
          {/* inner div so scrolls to end all the way */}
          <div style={{ flexFlow: 'row', padding: pad }}>
            {results.map((person, index) => {
              return (
                <OrbitCard
                  preventAutoSelect
                  pane="docked-search"
                  subPane="search"
                  className="quick-result-card"
                  key={person.id}
                  bit={person}
                  inGrid
                  isSelected={() => {
                    return searchStore.nextIndex === -1 && index === store.index
                  }}
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
                  onClick={searchStore.toggleSelected}
                />
              )
            })}
          </div>
        </QuickResultsFrame>
      </QuickResultsFrameHideScrollBar>
    )
  },
)
