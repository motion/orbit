import * as React from 'react'
import { App } from '@mcro/stores'
import { view, react, ensure, attach } from '@mcro/black'
import { compose } from '@mcro/helpers'
import { observeMany } from '@mcro/model-bridge'
import { OrbitCard } from '../../../views/OrbitCard'
import { SmallVerticalSpace } from '../../../views'
import * as Helpers from '../../../helpers'
import { PaneManagerStore } from '../PaneManagerStore'
import { Grid } from '../../../views/Grid'
import { sortBy } from 'lodash'
import { SelectionStore } from '../../../stores/SelectionStore'
import { PersonBitModel, PersonBit } from '@mcro/models'
import { ProvideHighlightsContextWithDefaults } from '../../../helpers/contexts/HighlightsContext'
import { NoResultsDialog } from './views/NoResultsDialog'
import { GridTitle } from '../../../views/GridTitle'
import { List } from 'react-virtualized'
import { ORBIT_WIDTH } from '@mcro/constants'
import { View } from '@mcro/ui'

const height = 56

type Props = {
  store?: OrbitDirectoryStore
  paneManagerStore: PaneManagerStore
  selectionStore: SelectionStore
  name: string
}

type ResultSection = { title: string; results: PersonBit[]; height: number }

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
    return this.props.paneManagerStore.activePane === 'people'
  }

  setSelectionHandler = react(
    () => [this.isActive, this.results],
    ([isActive]) => {
      ensure('is active', isActive)
      this.props.selectionStore.setResults([{ type: 'column', ids: this.results.map(x => x.id) }])
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
      console.time('filtering')
      const filtered = Helpers.fuzzyQueryFilter(query, people, {
        key: 'name',
      })
      console.timeEnd('filtering')
      return filtered
    },
    { defaultValue: [] },
  )

  get emailToIndex() {
    const res = {}
    for (const [index, { email }] of this.results.entries()) {
      res[email] = index
    }
    return res
  }

  getIndex = res => this.emailToIndex[res.email]

  get resultSections(): ResultSection[] {
    console.time('People.resultSections')
    const isFiltering = !!this.peopleQuery.length
    const total = this.results.length
    const perRow = 3
    const height = 60
    const separatorHeight = 25
    const sectionHeight = num => Math.ceil(num / perRow) * height + separatorHeight
    let sections: ResultSection[] = []
    // not that many, show just one section
    if (isFiltering || total < 10) {
      sections = [
        {
          title: isFiltering ? this.peopleQuery : 'All',
          results: this.results,
          height: sectionHeight(total),
        },
      ]
    } else {
      // create sections by letter
      let nextPeople = []
      let lastPersonLetter
      for (const [index, person] of this.results.entries()) {
        let letter = person.name[0].toLowerCase()
        // is number
        if (+person.name[0] === +person.name[0]) {
          letter = '0-9'
        }
        const isNewSection = lastPersonLetter && letter !== lastPersonLetter
        const isLastSection = index === total - 1
        if ((isNewSection || isLastSection) && nextPeople.length) {
          if (!lastPersonLetter) {
            lastPersonLetter = letter
          }
          sections = [
            ...sections,
            {
              title: lastPersonLetter.toUpperCase(),
              results: nextPeople,
              height: sectionHeight(nextPeople.length),
            },
          ]
          nextPeople = [person]
        } else {
          nextPeople.push(person)
        }
        lastPersonLetter = letter
      }
    }
    console.timeEnd('People.resultSections')
    return sections
  }
}

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

const PersonSection = ({
  people,
  title,
  getIndex,
}: {
  people: PersonBit[]
  title: string
  getIndex: any
}) => {
  return (
    <View padding={[0, 10]}>
      <GridTitle>{title}</GridTitle>
      <Grid columnWidth={120} gridAutoRows={height} gridGap={6}>
        {people.map(person => (
          <DirectoryPersonCard key={person.email} getIndex={getIndex} model={person} />
        ))}
      </Grid>
      <SmallVerticalSpace />
    </View>
  )
}

const lipHeight = 30

const decorate = compose(
  attach('selectionStore', 'paneManagerStore'),
  attach({
    store: OrbitDirectoryStore,
  }),
  view,
)
export const OrbitDirectory = decorate(({ store }: Props) => {
  const { results, resultSections } = store
  const total = results.length
  if (!total) {
    return <NoResultsDialog subName="the directory" />
  }
  return (
    <ProvideHighlightsContextWithDefaults value={{ words: store.peopleQuery.split(' ') }}>
      <List
        // ref={instance => (this.List = instance)}
        rowHeight={({ index }) => resultSections[index].height}
        rowRenderer={({ index, key }) => {
          const section = resultSections[index]
          return (
            <PersonSection
              key={`${key}${section.title}`}
              title={section.title}
              people={section.results}
              getIndex={store.getIndex}
            />
          )
        }}
        rowCount={resultSections.length}
        width={ORBIT_WIDTH}
        height={resultSections.reduce((a, b) => a + b.height, 0) + lipHeight}
      />
    </ProvideHighlightsContextWithDefaults>
  )
})
