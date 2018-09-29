import * as React from 'react'
import { App } from '@mcro/stores'
import { view, react, ensure } from '@mcro/black'
import { compose } from '@mcro/helpers'
import { observeMany } from '@mcro/model-bridge'
import { SubPane } from '../SubPane'
import { OrbitCard } from '../../../views/OrbitCard'
import { Title, VerticalSpace, SmallVerticalSpace } from '../../../views'
import * as Helpers from '../../../helpers'
import { PaneManagerStore } from '../PaneManagerStore'
import { Grid } from '../../../views/Grid'
import { sortBy } from 'lodash'
import { GridTitle } from './GridTitle'
import { SelectionStore } from './SelectionStore'
import { PersonBitModel, PersonBit } from '@mcro/models'
import { ProvideHighlightsContextWithDefaults } from '../../../helpers/contexts/HighlightsContext'
import { NoResultsDialog } from './views/NoResultsDialog'

const height = 56

type Props = {
  store?: OrbitDirectoryStore
  paneManagerStore: PaneManagerStore
  selectionStore: SelectionStore
  name: string
}

class OrbitDirectoryStore {
  props: Props
  allPeople = []
  private allPeople$ = observeMany(PersonBitModel).subscribe(people => {
    if (!people) return
    const sorted = sortBy(people.filter(x => !!x.name), x => x.name.toLowerCase())
    this.allPeople = sorted
  })

  willUnmount() {
    this.allPeople$.unsubscribe()
  }

  get isActive() {
    return this.props.paneManagerStore.activePane === this.props.name
  }

  setSelectionHandler = react(
    () => [this.isActive, this.results],
    ([isActive]) => {
      ensure('is active', isActive)
      this.props.selectionStore.setResults([{ type: 'column', items: this.results }])
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
  console.log('render OrbitDirectory')
  return (
    <SubPane name="directory" fadeBottom>
      <OrbitDirectoryInner key={0} {...props} />
    </SubPane>
  )
})

const DirectoryPersonCard = props => (
  <OrbitCard
    inGrid
    pane="docked"
    subPane="directory"
    titleProps={{
      ellipse: true,
    }}
    hide={{
      icon: true,
    }}
    style={{
      height,
    }}
    {...props}
  />
)

const createSection = (people: PersonBit[], letter, getIndex) => {
  return (
    <React.Fragment key={letter}>
      <GridTitle>{letter}</GridTitle>
      <Grid columnWidth={120} gridAutoRows={height}>
        {people.map(person => (
          <DirectoryPersonCard key={person.email} getIndex={getIndex} model={person} />
        ))}
      </Grid>
      <SmallVerticalSpace />
    </React.Fragment>
  )
}

const OrbitDirectoryInner = view(({ store }: Props) => {
  console.log('render OrbitDirectoryInner')
  const { results } = store
  const total = results.length
  if (!total) {
    return <NoResultsDialog />
  }
  let sections
  // not that many, show without sections
  if (total < 20) {
    sections = (
      <Grid columnWidth={120} gridAutoRows={height}>
        {results.map((person, index) => (
          <DirectoryPersonCard key={person.email} index={index} model={person} />
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
        sections.push(createSection(nextPeople, lastPersonLetter.toUpperCase(), store.getIndex))
        nextPeople = [person]
      } else {
        nextPeople.push(person)
      }
      lastPersonLetter = letter
    }
  }
  return (
    <ProvideHighlightsContextWithDefaults value={{ words: store.peopleQuery.split(' ') }}>
      <SmallVerticalSpace />
      <Title>Directory</Title>
      {sections}
      <VerticalSpace />
    </ProvideHighlightsContextWithDefaults>
  )
})
