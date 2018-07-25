import * as React from 'react'
import { view, react, compose } from '@mcro/black'
import { Person, getRepository } from '@mcro/models'
import { App, Desktop } from '@mcro/stores'
import { OrbitCard } from '../OrbitCard'
import * as UI from '@mcro/ui'
import { SearchStore } from '../../../stores/SearchStore'
import * as SearchStoreHelpers from '../../../stores/helpers/searchStoreHelpers'
import { flatten } from 'lodash'

const TYPE_DEBOUNCE = 150

const getPersonLike = async name => {
  return await getRepository(Person)
    .createQueryBuilder('person')
    .where('person.name like :nameLike', {
      nameLike: `%${name}%`,
    })
    .take(8)
    .getMany()
}

class QuickSearchStore {
  props: {
    searchStore: SearchStore
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
      const { people, searchQuery, integrations, nouns } = this.nlp
      console.log('goooooooooooooooooooooooooooo')
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
      {results.map(person => {
        return (
          <OrbitCard
            pane=""
            subPane=""
            key={person.id}
            bit={person}
            inGrid
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
