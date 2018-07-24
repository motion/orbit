import * as React from 'react'
import { view, react, compose } from '@mcro/black'
import { Person, getRepository } from '@mcro/models'
import { App, Desktop } from '@mcro/stores'
import { OrbitCard } from '../OrbitCard'
import * as UI from '@mcro/ui'

const TYPE_DEBOUNCE = 200

class QuickSearchStore {
  get isActive() {
    return App.state.query === this.search.query
  }

  search = react(
    () => [App.state.query, Desktop.state.lastBitUpdatedAt],
    async ([query], { sleep }) => {
      await sleep(TYPE_DEBOUNCE)
      const results = await getRepository(Person)
        .createQueryBuilder('person')
        .where('person.name like :nameLike', {
          nameLike: `%${query.split('').join('%')}%`,
        })
        .take(8)
        .getMany()
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

const QuickResultsFrame = view(UI.Row, {
  alignItems: 'center',
  padding: [0, 12],
  overflow: 'hidden',
  overflowX: 'auto',
})

const decorate = compose(
  view.attach({
    quickSearchStore: QuickSearchStore,
  }),
  view,
)

export const OrbitSearchQuickResults = decorate(({ quickSearchStore }) => {
  const { results } = quickSearchStore.search
  return (
    <QuickResultsFrame
      opacity={quickSearchStore.isActive ? 1 : 0.5}
      height={results.length ? 100 : 0}
    >
      {/* hacky we are filtering to just get people with images */}
      {results.filter(person => !!person.data.profile).map(person => {
        return (
          <OrbitCard
            pane=""
            subPane=""
            key={person.id}
            bit={person}
            style={{
              width: 240,
              height: 80,
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
    </QuickResultsFrame>
  )
})
