import * as React from 'react'
import { App } from '@mcro/stores'
import { view, react, ensure } from '@mcro/black'
import { compose } from '@mcro/helpers'
import { PersonRepository } from '../../../repositories'
import { SubPane } from '../SubPane'
import { OrbitCard } from '../../../views/OrbitCard'
import { Title, VerticalSpace } from '../../../views'
import * as Helpers from '../../../helpers'
import { PaneManagerStore } from '../PaneManagerStore'
import { modelQueryReaction } from '../../../repositories/modelQueryReaction'
import { Person } from '@mcro/models'
import { Grid } from '../../../views/Grid'
import { sortBy } from 'lodash'
import { GridTitle } from './GridTitle'
import { SelectionStore } from '../../../stores/SelectionStore'

const height = 69

export const Separator = view({
  padding: [3, 16],
  margin: [0, -16, 10],
})

type Props = {
  store?: OrbitDirectoryStore
  paneManagerStore: PaneManagerStore
  selectionStore: SelectionStore
  name: string
}

class OrbitDirectoryStore {
  props: Props

  get isActive() {
    return this.props.paneManagerStore.activePane === this.props.name
  }

  setSelectionHandler = react(
    () => [this.isActive, this.results],
    ([isActive]) => {
      if (!isActive) throw react.cancel
      this.props.selectionStore.setResults([
        { type: 'column', items: this.results },
      ])
    },
  )

  queryWhenActive = react(
    () => App.state.query,
    (query, { state }) => {
      if (state.hasResolvedOnce) {
        ensure('is active and resolved once', this.isActive)
      }
      return query
    },
    {
      defaultValue: '',
    },
  )

  get peopleQuery() {
    const query = this.queryWhenActive
    const prefix = query[0] === '@'
    return query.slice(prefix ? 1 : 0)
  }

  results: Person[] = react(
    () => [this.peopleQuery, this.allPeople],
    ([query, people]) => {
      if (!query) {
        return people
      }
      return Helpers.fuzzy(query, people, {
        key: 'name',
      })
    },
    { defaultValue: [] },
  )

  allPeople = modelQueryReaction(
    () => PersonRepository.find({ take: 100, where: { integration: 'slack' } }),
    people => {
      if (!this.isActive && this.allPeople.length) {
        throw react.cancel
      }
      return sortBy(people, x => x.name.toLowerCase())
    },
    {
      defaultValue: [],
    },
  )

  getIndex = id => {
    return this.results.findIndex(x => x.id === id)
  }
}

const decorator = compose(
  view.attach('selectionStore', 'paneManagerStore'),
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

const createSection = (people: Person[], letter, getIndex) => {
  return (
    <React.Fragment key={letter}>
      <GridTitle>{letter}</GridTitle>
      <Grid>
        {people.map(bit => (
          <OrbitCard
            key={bit.id}
            inGrid
            pane="docked"
            subPane="directory"
            getIndex={getIndex}
            // @ts-ignore
            bit={bit}
            hide={{
              icon: true,
            }}
            style={{
              height,
            }}
          />
        ))}
      </Grid>
      <VerticalSpace />
    </React.Fragment>
  )
}

const OrbitDirectoryInner = view(({ store }: Props) => {
  const { results } = store
  const total = results.length
  if (!total) {
    return null
  }
  console.log('rendering directory...')
  // create sections by letter
  let sections = []
  let nextPeople = []
  let lastPersonLetter
  for (const [index, person] of results.entries()) {
    let letter = person.name[0].toLowerCase()
    const isNewSection = lastPersonLetter && letter !== lastPersonLetter
    if ((isNewSection && nextPeople.length) || index === total - 1) {
      if (!lastPersonLetter) {
        lastPersonLetter = letter
      }
      sections.push(
        createSection(
          nextPeople,
          lastPersonLetter.toUpperCase(),
          store.getIndex,
        ),
      )
      nextPeople = [person]
    } else {
      nextPeople.push(person)
    }
    lastPersonLetter = letter
  }
  return (
    <>
      <VerticalSpace />
      <Title>Directory</Title>
      {sections}
    </>
  )
})
