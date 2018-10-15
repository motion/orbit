import { store, react, ensure } from '@mcro/black'
import { AppsStore } from '../../AppsStore'
import { memoize, uniqBy } from 'lodash'
import { MarkType, NLPResponse } from './nlpStore/types'
import { Setting } from '@mcro/models'
import { NLPStore } from './NLPStore'
import { QueryStore } from './QueryStore'
import { SearchStore } from './SearchStore'

export type SearchFilter = {
  type: string
  icon: string
  name: string
  active: boolean
}

type DateSelections = {
  startDate: Date
  endDate: Date
  key?: string
}

const suggestedDates = [
  { text: 'Last Week', type: MarkType.Date },
  { text: 'Last Month', type: MarkType.Date },
]

// @ts-ignore
@store
export class SearchFilterStore /* extends Store */ {
  queryStore: QueryStore
  appsStore: AppsStore
  nlpStore: NLPStore
  searchStore: SearchStore

  extraFiltersHeight = 325
  extraFiltersVisible = false
  disabledFilters = {}
  exclusiveFilters = {}
  // sort by
  sortOptions = ['Relevant', 'Recent'] as ('Relevant' | 'Recent')[]
  sortBy = this.sortOptions[0]
  // search by
  searchOptions = ['Bit', 'Topic'] as ('Topic' | 'Bit')[]
  searchBy = this.searchOptions[0]

  dateState: DateSelections = {
    startDate: null,
    endDate: null,
  }

  constructor({ queryStore, appsStore, nlpStore, searchStore }) {
    this.appsStore = appsStore
    this.nlpStore = nlpStore
    this.queryStore = queryStore
    this.searchStore = searchStore
  }

  // todo: this should replace any existing filters of same type
  setFilter = (type: string, value: string) => {
    console.log('should set filter', type, value)
  }

  setExtraFiltersVisible = target => {
    this.extraFiltersVisible = !!target
  }

  clearDate = () => {
    this.dateState = { startDate: null, endDate: null }
  }

  get extraHeight() {
    return this.extraFiltersVisible ? this.extraFiltersHeight : 0
  }

  // this contains the segments we found via nlp in order of search
  // like [{ text: 'hey' }, { text: 'world', type: 'integration }]
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

  get allFilters() {
    return [
      // keep them in the order of the query so they dont jump around
      ...this.queryFilters,
      ...this.suggestedFilters,
    ]
  }

  get activeFilters() {
    return this.queryFilters.filter(x => x.active)
  }

  get inactiveFilters() {
    return this.queryFilters.filter(x => !x.active)
  }

  get hasDateFilter() {
    return !!this.dateState.endDate || !!this.dateState.startDate
  }

  get activeDateFilters() {
    return this.activeFilters.filter(part => part.type === MarkType.Date)
  }

  get queryFilters() {
    this.disabledFilters
    return this.parsedQuery.filter(this.isFilter).map(x => ({
      ...x,
      active: this.isActive(x),
    }))
  }

  get activeMarks() {
    if (!this.nlpStore.marks) {
      return null
    }
    return this.nlpStore.marks.filter(mark => !this.disabledFilters[mark[3].toLowerCase()])
  }

  get hasExclusiveFilters() {
    return Object.keys(this.exclusiveFilters).length
  }

  get uniqueSettings(): Setting[] {
    const intSettings = (this.appsStore.appsList || []).filter(x => x.type !== 'setting')
    const unique = uniqBy(intSettings, x => x.type)
    return unique
  }

  get hasIntegrationFilters() {
    return this.integrationFilters.some(x => x.active)
  }

  get integrationFilters(): SearchFilter[] {
    const { exclusiveFilters } = this
    return this.uniqueSettings.filter(x => x.type !== 'app1').map(setting => ({
      type: setting.type,
      icon: setting.type,
      name: this.appsStore.getTitle(setting),
      active: this.hasExclusiveFilters ? exclusiveFilters[setting.type] : false,
    }))
  }

  get suggestedPeople() {
    return (this.nlpStore.peopleNames || []).slice(0, 2).map(name => ({
      text: name,
      type: MarkType.Person,
    }))
  }

  get suggestedFilters() {
    if (!this.parsedQuery) {
      return suggestedDates
    }
    let suggestions = []
    // show location filters based on current search
    suggestions = [...suggestions, ...this.searchLocations]
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

  // unique locations currently in search results list
  searchLocations = react(
    () => this.searchStore.searchState,
    async ({ results }, { sleep }) => {
      ensure('results', !!results && results.length)
      await sleep(100)
      return [...new Set(results.map(x => x.location && x.location.name))]
        .filter(Boolean)
        .map(text => ({
          text,
          type: MarkType.Location,
        }))
    },
    {
      defaultValue: [],
    },
  )

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
        this.dateState = this.nlpStore.nlp.date
        // set Recent
        this.sortBy = this.sortOptions[1]
      }
    },
  )

  resetIntegrationFiltersOnNLPChange = react(
    () => this.nlpStore.nlp,
    (nlp: NLPResponse) => {
      ensure('nlp', !!nlp)
      // reset integration inactive filters
      const { integrations } = nlp
      ensure('integrations', integrations && !!integrations.length)
      this.exclusiveFilters = this.uniqueSettings.reduce((acc, setting: Setting) => {
        acc[setting.type] = integrations.some(x => x === setting.type)
        return acc
      }, {})
    },
  )

  resetFiltersOnSearchClear = react(
    () => !!this.queryStore.query,
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
      this.queryStore.setQuery(`${this.queryStore.query} ${name}`.trim())
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

  integrationFilterToggler = memoize((filter: SearchFilter) => {
    return () => this.toggleExclusiveFilter(filter)
  })

  toggleExclusiveFilter = (filter: SearchFilter) => {
    this.exclusiveFilters = {
      ...this.exclusiveFilters,
      [filter.type]: !this.exclusiveFilters[filter.type],
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
