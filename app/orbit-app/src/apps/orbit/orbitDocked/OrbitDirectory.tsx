import * as React from 'react'
import { App } from '@mcro/stores'
import { view, react } from '@mcro/black'
import { compose } from '@mcro/helpers'
import { PersonRepository } from '../../../repositories'
import { SubPane } from '../SubPane'
import { OrbitCard } from '../../../views/OrbitCard'
import { SubTitle, Title } from '../../../views'
import * as Helpers from '../../../helpers'
import { PaneManagerStore } from '../PaneManagerStore'
import { SearchStore } from '../../../stores/SearchStore'
import { modelQueryReaction } from '../../../repositories/modelQueryReaction'
import { Person } from '@mcro/models'
import { Grid } from '../../../views/Grid'
import { sortBy } from 'lodash'

const height = 69

const Separator = view({
  padding: [3, 16],
  margin: [0, -16, 10],
})
// Separator.theme = ({ theme }) => ({
//   background: theme.base.background.alpha(0.1),
// })

const VerticalSpace = view({
  height: 10,
})

const GridTitle = props => (
  <Separator>
    <SubTitle
      fontSize={15}
      lineHeight={15}
      fontWeight={600}
      padding={0}
      {...props}
    />
  </Separator>
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

  results = modelQueryReaction(
    () => PersonRepository.find({ take: 100, where: { integration: 'slack' } }),
    people => {
      if (!this.isActive && this.results.length) {
        throw react.cancel
      }
      return sortBy(people, x => x.name.toLowerCase())
    },
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
      <VerticalSpace />
    </React.Fragment>
  )
}

const OrbitDirectoryInner = view(({ store }: Props) => {
  const total = store.results.length
  if (!total) {
    return null
  }
  // create sections by letter
  let sections = []
  let nextPeople = []
  let offset = 0
  let lastPersonLetter
  for (const [index, person] of store.results.entries()) {
    let letter = person.name[0].toLowerCase()
    const isNewSection = lastPersonLetter && letter !== lastPersonLetter
    if ((isNewSection && nextPeople.length) || index === total - 1) {
      sections.push(
        createSection(
          nextPeople,
          lastPersonLetter.toUpperCase(),
          offset,
          total,
        ),
      )
      offset += nextPeople.length
      nextPeople = [person]
    } else {
      nextPeople.push(person)
    }
    lastPersonLetter = letter
  }
  return (
    <>
      <Title>Directory</Title>
      {sections}
    </>
  )
})
