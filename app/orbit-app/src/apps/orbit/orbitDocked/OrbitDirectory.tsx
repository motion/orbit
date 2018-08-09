import * as React from 'react'
import { App } from '@mcro/stores'
import { view, react } from '@mcro/black'
import { compose } from '@mcro/helpers'
import { PersonRepository } from '../../../repositories'
import { SubPane } from '../SubPane'
import { OrbitCard } from '../../../views/OrbitCard'
import { SubTitle } from '../../../views'
import * as Helpers from '../../../helpers'
import { PaneManagerStore } from '../PaneManagerStore'
import { SearchStore } from '../../../stores/SearchStore'
import { modelQueryReaction } from '../../../repositories/modelQueryReaction'
import { Person } from '@mcro/models'

const height = 77
const gap = 10

const Grid = view({
  display: 'grid',
  gap,
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  // height of items
  gridAutoRows: height,
  margin: [0, -4],
})

const GridTitle = props => (
  <SubTitle fontSize={22} fontWeight={400} padding={[12, 0, 4, 3]} {...props} />
)

type Props = {
  store?: OrbitDirectoryStore
  name: string
  paneManagerStore: PaneManagerStore
  searchStore: SearchStore
}

class OrbitDirectoryStore {
  props: Props

  setGetResults = react(
    () => [this.isActive, this.results],
    async ([isActive], { sleep }) => {
      if (!isActive) {
        throw react.cancel
      }
      console.log('IS ACTIVE SETTING')
      await sleep(40)
      const getResults = () => this.results
      // @ts-ignore
      getResults.shouldFilter = true
      this.props.searchStore.setGetResults(getResults)
    },
    { immediate: true },
  )

  get isActive() {
    return this.props.paneManagerStore.activePane === this.props.name
  }

  get peopleQuery() {
    const query = App.state.query
    if (!query) {
      return ''
    }
    const prefix = query[0] === '@'
    return query.slice(prefix ? 1 : 0)
  }

  people: Person[] = react(
    () => [this.peopleQuery, this.isActive],
    ([query, isActive], { state }) => {
      if (!isActive && state.hasResolvedOnce) {
        throw react.cancel
      }
      return Helpers.fuzzy(query, this.results, {
        key: 'name',
      })
    },
    { immediate: true, defaultValue: [] },
  )

  // poll every few seconds while active
  results = modelQueryReaction(
    () => PersonRepository.find({ take: 100, where: { integration: 'slack' } }),
    {
      defaultValue: [],
    },
  )
}

const decorator = compose(
  view.attach('searchStore'),
  view.attach({
    store: OrbitDirectoryStore,
  }),
)

export const OrbitDirectory = decorator((props: Props) => {
  return (
    <SubPane name="directory" fadeBottom>
      <OrbitDirectoryInner {...props} />
    </SubPane>
  )
})

const createSection = (people: Person[], letter, offset, total) => {
  return (
    <React.Fragment key={letter}>
      <GridTitle>{letter}</GridTitle>
      <Grid>
        {people.map((bit, index) => (
          <OrbitCard
            key={bit.id}
            inGrid
            pane="docked"
            subPane="directory"
            index={offset + index}
            // @ts-ignore
            bit={bit}
            total={total}
            hide={{
              icon: true,
            }}
            style={{
              height,
            }}
          />
        ))}
      </Grid>
    </React.Fragment>
  )
}

const OrbitDirectoryInner = view(({ store }: Props) => {
  const total = store.results.length
  if (!total) {
    return null
  }
  console.log('RENDER PRECIOUS STUFF')
  const byLetter = {}
  for (const person of store.people) {
    const initial = person.name[0].toLowerCase()
    byLetter[initial] = byLetter[initial] || []
    byLetter[initial].push(person)
  }
  const sections = []
  let offset = 0
  const letters = Object.keys(byLetter)
  letters.sort((a, b) => a.localeCompare(b))
  for (const letter of letters) {
    const nextPeople = byLetter[letter]
    sections.push(
      createSection(
        nextPeople,
        letter.toUpperCase(),
        offset,
        store.people.length,
      ),
    )
    offset += nextPeople.length
  }
  return sections
})
