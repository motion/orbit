import * as React from 'react'
import { react, always } from '@mcro/black'
import { observeMany } from '@mcro/model-bridge'
import { sortBy } from 'lodash'
import { PersonBitModel, PersonBit } from '@mcro/models'
import { NoResultsDialog } from '../../components/NoResultsDialog'
import { AppProps } from '../AppProps'
import { fuzzyQueryFilter } from '../../helpers'
import { useStore } from '@mcro/use-store'
import { SearchResultsList } from '../../views/Lists/SearchResultsList'
import { observer } from 'mobx-react-lite'

class PeopleIndexStore {
  props: AppProps<'people'>

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

  // TODO THIS COULD BE SUPER SIMPLE INDEX MAP
  // and then we just use List.getItemProps (index)
  get resultsWithSections(): PersonBit[] {
    const total = this.results.length

    if (total < 10) {
      return this.results
    }

    let resultsSectioned = []
    let lastLetter = ''

    for (const person of this.results) {
      let letter = person.name[0].toLowerCase()
      // is number
      if (+person.name[0] === +person.name[0]) {
        letter = '0-9'
      }
      const isNewSection = letter !== lastLetter
      lastLetter = letter
      if (isNewSection) {
        resultsSectioned.push({ ...person, separator: letter.toUpperCase() })
      } else {
        resultsSectioned.push(person)
      }
    }

    return resultsSectioned
  }
}

export const PeopleAppIndex = observer((props: AppProps<'people'>) => {
  const store = useStore(PeopleIndexStore, props)
  const total = store.resultsWithSections.length
  if (!total) {
    return <NoResultsDialog subName="the directory" />
  }
  return (
    <SearchResultsList
      getRef={(a, b) => {
        console.log('got', a, b)
        window.x = a
      }}
      query={store.peopleQuery}
      itemProps={props.itemProps}
      maxHeight={props.appStore.maxHeight}
      results={store.resultsWithSections}
      rowCount={total}
    />
  )
})
