import { always, decorate, ensure, react } from '@o/use-store'
import { memoize, uniqBy } from 'lodash'

import { MarkType } from '../types/NLPTypes'
import { NLPStore } from './NLPStore/NLPStore'
import { QueryStore } from './QueryStore'

export type SearchFilter = {
  id: number
  type: string
  app: string
  name: string
  active: boolean
}

type DateSelections = {
  startDate: Date | null
  endDate: Date | null
  key?: string
}

type Filter = {
  type: MarkType
  text: string
  active?: boolean
}

const suggestedDates: Filter[] = [
  { text: 'Last Week', type: MarkType.Date },
  { text: 'Last Month', type: MarkType.Date },
]

export type SourceDesc = { name: string; type: string }

@decorate
export class QueryFilterStore {
  queryStore: QueryStore
  nlpStore: NLPStore
  disabledFilters = {}
  exclusiveFilters = {}
  // sort by
  sortOptions = ['Relevant', 'Recent'] as ('Relevant' | 'Recent')[]
  sortBy = this.sortOptions[0]
  // search by
  searchOptions = ['Bit', 'Topic'] as ('Topic' | 'Bit')[]
  searchBy = this.searchOptions[0]
  activeSources: SourceDesc[] = []

  dateState: DateSelections = {
    startDate: null,
    endDate: null,
  }

  constructor({ queryStore, nlpStore }) {
    this.nlpStore = nlpStore
    this.queryStore = queryStore
  }

  setSources(sources: SourceDesc[]) {
    this.activeSources = sources
  }

  // todo: this should replace any existing filters of same type
  setFilter = (type: string, value: string) => {
    console.log('should set filter', type, value)
  }

  clearDate = () => {
    this.dateState = { startDate: null, endDate: null }
  }

  // this contains the segments we found via nlp in order of search
  // like [{ text: 'hey' }, { text: 'world', type: 'source }]
  get parsedQuery() {
    return this.nlpStore.nlp.parsedQuery || []
  }

  isActive = querySegment => !this.disabledFilters[querySegment.text.toLowerCase().trim()]
  isntFilter = querySegment => !querySegment.type
  isFilter = querySegment => !!querySegment.type

  // allows back in text segments that aren't filtered
  get activeQuery() {
    return this.parsedQuery
      .filter(this.isntFilter)
      .filter(this.isActive)
      .map(x => x.text.trim())
      .join(' ')
      .trim()
  }

  get allFilters(): Filter[] {
    return uniqBy(
      [
        // keep them in the order of the query so they dont jump around
        ...this.queryFilters,
        ...this.suggestedFilters,
      ],
      x => `${x.type}${x.text}`,
    )
  }

  get activeFilters(): Filter[] {
    return this.queryFilters.filter(x => x.active)
  }

  get inactiveFilters(): Filter[] {
    return this.queryFilters.filter(x => !x.active)
  }

  get hasDateFilter(): boolean {
    return !!this.dateState.endDate || !!this.dateState.startDate
  }

  get activeDateFilters(): Filter[] {
    return this.activeFilters.filter(part => part.type === MarkType.Date)
  }

  get queryFilters(): Filter[] {
    this.disabledFilters
    return this.parsedQuery.filter(this.isFilter).map(x => ({
      ...x,
      type: x.type!,
      active: this.isActive(x),
    }))
  }

  get activeMarks() {
    if (!this.nlpStore.marks) {
      return null
    }
    return this.nlpStore.marks.filter(mark => !this.disabledFilters[mark[3].toLowerCase()])
  }

  get hasAppFilters() {
    return this.appFilters.some(x => x.active)
  }

  get appFilters(): SearchFilter[] {
    // !TODO
    return this.activeSources.map((app, id) => ({
      id,
      type: 'source',
      app: app.type,
      name: app.name,
      active: Object.keys(this.exclusiveFilters).length ? this.exclusiveFilters[app.type] : false,
    }))
  }

  get suggestedPeople(): Filter[] {
    return (this.nlpStore.peopleNames || []).slice(0, 2).map(name => ({
      text: name,
      type: MarkType.Person,
    }))
  }

  get suggestedFilters(): Filter[] {
    if (!this.parsedQuery) {
      return suggestedDates
    }
    let suggestions: Filter[] = []
    // show location filters based on current search
    const hasDates = this.parsedQuery.some(x => x.type === MarkType.Date)
    const numPeople = this.parsedQuery.filter(x => x.type === MarkType.Person).length
    if (!hasDates) {
      suggestions = [...suggestions, ...suggestedDates]
    }
    if (numPeople < 5) {
      suggestions = [...suggestions, ...this.suggestedPeople]
    }
    return suggestions
  }

  updateDateStateOnNLPDate = react(
    () => this.activeDateFilters,
    dateQueries => {
      if (!dateQueries.length) {
        this.dateState = {
          startDate: null,
          endDate: null,
        }
        // set Relevant
        this.sortBy = this.sortOptions[0]
      } else {
        if (this.nlpStore.nlp.date) {
          this.dateState = this.nlpStore.nlp.date
        }
        // set Recent
        this.sortBy = this.sortOptions[1]
      }
    },
  )

  resetAppFiltersOnNLPChange = react(
    () => always(this.nlpStore.nlp),
    () => {
      const nlp = this.nlpStore.nlp
      ensure('nlp', !!nlp)
      // reset source inactive filters
      ensure('sources', !!(nlp.apps && nlp.apps.length))
      this.exclusiveFilters = this.activeSources.reduce((acc, app) => {
        acc[app.type] = nlp.apps!.some(x => x === app.type)
        return acc
      }, {})
    },
  )

  resetFiltersOnSearchClear = react(
    () => this.queryStore.hasQuery,
    hasQuery => {
      ensure('no query', !hasQuery)
      this.resetAllFilters()
    },
  )

  resetAllFilters = () => {
    this.disabledFilters = {}
    this.exclusiveFilters = {}
    this.dateState = {
      startDate: null,
      endDate: null,
    }
  }

  hasActiveFilter = name => this.parsedQuery.some(x => x.text.toLowerCase() === name.toLowerCase())

  toggleFilterActive = (name: string) => {
    // if adding a suggested filter, add it dont disable
    if (!this.hasActiveFilter(name)) {
      this.queryStore.setQuery(`${this.queryStore.queryInstant} ${name}`.trim())
      return
    }
    const key = name.toLowerCase()
    this.disabledFilters = {
      ...this.disabledFilters,
      [key]: !this.disabledFilters[key],
    }
  }

  toggleSearchBy = () => {
    const cur = this.searchOptions.indexOf(this.searchBy)
    this.searchBy = this.searchOptions[(cur + 1) % this.searchOptions.length]
  }

  toggleSortBy = () => {
    const cur = this.sortOptions.indexOf(this.sortBy)
    this.sortBy = this.sortOptions[(cur + 1) % this.sortOptions.length]
  }

  sourceFilterToggler = memoize((filter: SearchFilter) => {
    return () => this.toggleSourceFilter(filter)
  })

  toggleSourceFilter = (filter: SearchFilter) => {
    this.exclusiveFilters = {
      ...this.exclusiveFilters,
      [filter.app]: !this.exclusiveFilters[filter.app],
    }
  }

  onChangeDate = date => {
    const key = Object.keys(date)[0]
    const firstSelection = date[key]
    if (!firstSelection) {
      return
    }
    this.dateState = firstSelection
  }
}
