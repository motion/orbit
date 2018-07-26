import * as React from 'react'
import { view, react, compose, on } from '@mcro/black'
import { Person, getRepository } from '@mcro/models'
import { App, Desktop } from '@mcro/stores'
import { OrbitCard } from '../OrbitCard'
import * as UI from '@mcro/ui'
import { SearchStore } from '../../../stores/SearchStore'
import * as SearchStoreHelpers from '../../../stores/helpers/searchStoreHelpers'
import { flatten } from 'lodash'

const TYPE_DEBOUNCE = 150

class QuickSearchStore {
  props: {
    searchStore: SearchStore
  }

  frameRef = React.createRef<HTMLDivElement>()
  preselectedIndex = 0

  didMount() {
    on(this, this.props.searchStore, 'key', key => {
      if (key === 'right') {
        this.increment()
      }
      if (key === 'left') {
        this.decrement()
      }
    })
  }

  scrollToSelected = react(
    () => this.preselectedIndex,
    index => {
      const frame = this.frameRef.current
      if (!frame) {
        throw react.cancel
      }
      if (index === 0) {
        frame.scrollLeft = 0
        return
      }
      const activeCard = Array.from(
        frame.querySelectorAll('.quick-result-card'),
      )[index] as HTMLDivElement
      frame.scrollLeft = activeCard.offsetLeft
    },
  )

  resetSelectedOnSearch = react(
    () => App.state.query.length,
    () => {
      this.preselectedIndex = 0
    },
  )

  increment = () => {
    if (this.preselectedIndex < this.search.results.length - 1) {
      this.preselectedIndex += 1
    }
  }

  decrement = () => {
    if (this.preselectedIndex > 0) {
      this.preselectedIndex -= 1
    }
  }

  get isActive() {
    return App.state.query === this.search.query
  }

  get nlp() {
    return this.props.searchStore.nlpStore.nlp
  }

  personQueryBuilder = getRepository(Person).createQueryBuilder('person')

  search = react(
    () => [App.state.query, Desktop.state.lastBitUpdatedAt],
    async ([query], { sleep, when }) => {
      await sleep(TYPE_DEBOUNCE)
      await when(() => this.nlp.query === query)
      const { people, searchQuery, integrations /* , nouns */ } = this.nlp
      const allResults = await Promise.all([
        // fuzzy people results
        this.personQueryBuilder
          .where('person.name like :nameLike', {
            nameLike: `%${searchQuery.split('').join('%')}%`,
          })
          .take(3)
          .getMany(),
      ])
      const exactPeople = await Promise.all(
        people.map(name => {
          return this.personQueryBuilder
            .where('person.name like :nameLike', {
              nameLike: `%${name}%`,
            })
            .getOne()
        }),
      )
      const results = flatten([
        ...exactPeople,
        integrations.map(name => ({ name, icon: name })),
        ...SearchStoreHelpers.matchSort(searchQuery, flatten(allResults)),
      ]).filter(Boolean)
      return {
        query,
        results,
      }
    },
    {
      immediate: true,
      defaultValue: { results: [] },
    },
  )
}

const height = 100
const pad = 12
const frameHeight = height + pad * 2
const scrollBarHeight = 16

const QuickResultsFrameHideScrollBar = view(UI.View, {
  overflow: 'hidden',
})

const QuickResultsFrame = view(UI.Row, {
  alignItems: 'center',
  height: frameHeight + scrollBarHeight,
  paddingBottom: scrollBarHeight,
  marginBottom: -scrollBarHeight,
  overflow: 'hidden',
  overflowX: 'auto',
})

const decorate = compose(
  view.attach({
    quickSearchStore: QuickSearchStore,
  }),
  view,
)

export const OrbitSearchQuickResults = decorate(
  ({ searchStore, quickSearchStore }) => {
    const { results } = quickSearchStore.search
    return (
      <QuickResultsFrameHideScrollBar height={results.length ? frameHeight : 0}>
        <QuickResultsFrame
          opacity={quickSearchStore.isActive ? 1 : 0.5}
          forwardRef={quickSearchStore.frameRef}
        >
          {/* inner div so scrolls to end all the way */}
          <div style={{ flexFlow: 'row', padding: pad }}>
            {results.map((person, index) => {
              return (
                <OrbitCard
                  pane=""
                  subPane=""
                  className="quick-result-card"
                  key={person.id}
                  bit={person}
                  inGrid
                  isSelected={() => {
                    return (
                      searchStore.nextIndex === -1 &&
                      index === quickSearchStore.preselectedIndex
                    )
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
                  onSelect={ref => {
                    App.actions.selectItem(person, ref)
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
