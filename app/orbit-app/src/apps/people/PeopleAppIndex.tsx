import * as React from 'react'
import { react, always } from '@mcro/black'
import { observeMany } from '@mcro/model-bridge'
import { OrbitCard } from '../../views/OrbitCard'
import { SmallVerticalSpace } from '../../views'
import { Grid } from '../../views/Grid'
import { sortBy } from 'lodash'
import { PersonBitModel, PersonBit } from '@mcro/models'
import { ProvideHighlightsContextWithDefaults } from '../../helpers/contexts/HighlightsContext'
import { NoResultsDialog } from '../../components/NoResultsDialog'
import { GridTitle } from '../../views/GridTitle'
import { List } from 'react-virtualized'
import { ORBIT_WIDTH } from '@mcro/constants'
import { View } from '@mcro/ui'
import { AppProps } from '../AppProps'
import { fuzzyQueryFilter } from '../../helpers'
import { useStore } from '@mcro/use-store'
import { IS_MENU } from '../../constants'
import { memo } from '../../helpers/memo'

const height = 56

type ResultSection = { title: string; results: PersonBit[]; height: number }

class PeopleIndexStore {
  props: AppProps

  allPeople = []
  private allPeople$ = observeMany(PersonBitModel, { args: { take: 100 } }).subscribe(people => {
    if (!people) return
    const sorted = sortBy(people.filter(x => !!x.name), x => x.name.toLowerCase())
    this.allPeople = sorted
  })

  willUnmount() {
    this.allPeople$.unsubscribe()
  }

  get isActive() {
    return this.props.appStore.isActive
  }

  get peopleQuery() {
    const query = this.props.appStore.activeQuery
    const prefix = query[0] === '@'
    return query.slice(prefix ? 1 : 0)
  }

  setSelectionResults = react(
    () => always(this.results),
    () => {
      this.props.appStore.setResults([
        { type: 'column', indices: this.results.map((_, index) => index) },
      ])
    },
  )

  results: PersonBit[] = react(
    () => always(this.peopleQuery, this.allPeople),
    () => {
      return fuzzyQueryFilter(this.peopleQuery, this.allPeople, {
        key: 'name',
      })
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
    return sections
  }
}

const DirectoryPersonCard = props => (
  <OrbitCard
    inGrid
    appType="people"
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

export const PeopleAppIndex = memo((props: AppProps) => {
  const { results, resultSections, peopleQuery, getIndex } = useStore(PeopleIndexStore, props)
  const total = results.length
  if (!total) {
    return <NoResultsDialog subName="the directory" />
  }
  return (
    <ProvideHighlightsContextWithDefaults value={{ words: peopleQuery.split(' ') }}>
      <List
        rowHeight={({ index }) => resultSections[index].height}
        rowRenderer={({ index, key }) => {
          const section = resultSections[index]
          return (
            <PersonSection
              key={`${key}${section.title}`}
              title={section.title}
              people={section.results}
              getIndex={getIndex}
            />
          )
        }}
        rowCount={resultSections.length}
        width={IS_MENU ? 287 : ORBIT_WIDTH}
        height={Math.min(
          props.appStore.maxHeight,
          resultSections.reduce((a, b) => a + b.height, 0) + lipHeight,
        )}
      />
    </ProvideHighlightsContextWithDefaults>
  )
})
