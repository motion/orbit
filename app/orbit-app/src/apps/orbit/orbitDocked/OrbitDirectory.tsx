import * as React from 'react'
import { App } from '@mcro/stores'
import { view, react, ensure } from '@mcro/black'
import { compose } from '@mcro/helpers'
import { PersonBitRepository } from '../../../repositories'
import { SubPane } from '../SubPane'
import { OrbitCard } from '../../../views/OrbitCard'
import { Title, VerticalSpace, SmallVerticalSpace } from '../../../views'
import * as Helpers from '../../../helpers'
import { PaneManagerStore } from '../PaneManagerStore'
import { modelQueryReaction } from '../../../repositories/modelQueryReaction'
import { Grid } from '../../../views/Grid'
import { sortBy } from 'lodash'
import { GridTitle } from './GridTitle'
import { SelectionStore } from '../../../stores/SelectionStore'
import { PersonBit } from '../../../../../models/src'

const height = 60

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

  results: PersonBit[] = react(
    () => [this.peopleQuery, this.allPeople],
    ([query, people]) => {
      if (!query) {
        return people
      }
      return Helpers.fuzzyQueryFilter(query, people, {
        key: 'name',
      })
    },
    { defaultValue: [] },
  )

  allPeople = modelQueryReaction(
    () =>
      PersonBitRepository.find({
        take: 4000,
        // where: { name: { $not: null } /* , photo: { $not: null } */ },
      }),
    people => {
      if (!this.isActive && this.allPeople.length) {
        throw react.cancel
      }
      return sortBy(people.filter(x => !!x.name), x => x.name.toLowerCase())
    },
    {
      defaultValue: [],
    },
  )

  getIndex = item => {
    return this.results.findIndex(x => x.email === item.email)
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

const createSection = (people: PersonBit[], letter, getIndex) => {
  return (
    <React.Fragment key={letter}>
      <GridTitle>{letter}</GridTitle>
      <Grid columnWidth={140} gridAutoRows={height}>
        {people.map(person => (
          <OrbitCard
            key={person.email}
            inGrid
            pane="docked"
            subPane="directory"
            getIndex={getIndex}
            model={person}
            hide={{
              icon: true,
            }}
            style={{
              height,
            }}
          />
        ))}
      </Grid>
      <SmallVerticalSpace />
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
  let sections
  // not that many, show without sections
  if (total < 10) {
    sections = (
      <Grid gridAutoRows={height}>
        {results.map((person, index) => (
          <OrbitCard
            key={person.email}
            inGrid
            pane="docked"
            subPane="directory"
            index={index}
            model={person}
            hide={{
              icon: true,
            }}
            style={{
              height,
            }}
          />
        ))}
      </Grid>
    )
  } else {
    // create sections by letter
    sections = []
    let nextPeople = []
    let lastPersonLetter
    for (const [index, person] of results.entries()) {
      let letter = person.name[0].toLowerCase()
      const isNewSection = lastPersonLetter && letter !== lastPersonLetter
      const isLastSection = index === total - 1
      if ((isNewSection || isLastSection) && nextPeople.length) {
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
  }
  return (
    <>
      <SmallVerticalSpace />
      <Title>Directory</Title>
      {sections}
      <VerticalSpace />
    </>
  )
})
