import { store, react } from '@mcro/black'
import { IntegrationSettingsStore } from './IntegrationSettingsStore'
import { memoize, uniqBy } from 'lodash'
import { MarkType, NLPResponse } from './nlpStore/types'
import { Setting } from '@mcro/models'
import { NLPStore } from './NLPStore'
import { hoverSettler } from '../helpers/hoverSettler'
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
  integrationSettingsStore: IntegrationSettingsStore
  nlpStore: NLPStore
  searchStore: SearchStore

  extraFiltersHeight = 325
  extraFiltersVisible = false
  disabledFilters = {}
  exclusiveFilters = {}
  sortBy = 'Relevant'
  sortOptions = ['Relevant', 'Recent']

  dateState: DateSelections = {
    startDate: null,
    endDate: null,
  }

  dateHover = hoverSettler({
    enterDelay: 400,
    leaveDelay: 400,
  })()

  constructor({ queryStore, integrationSettingsStore, nlpStore, searchStore }) {
    this.integrationSettingsStore = integrationSettingsStore
    this.nlpStore = nlpStore
    this.queryStore = queryStore
    this.searchStore = searchStore
  }

  willMount() {
    this.dateHover.setOnHovered(target => {
      this.setExtraFiltersVisible(target)
    })
  }

  setExtraFiltersVisible = target => {
    this.extraFiltersVisible = !!target
  }

  get extraHeight() {
    return this.extraFiltersVisible ? this.extraFiltersHeight : 0
  }

  // this contains the segments we found via nlp in order of search
  // like [{ text: 'hey' }, { text: 'world', type: 'integration }]
  get parsedQuery() {
    return this.nlpStore.nlp.parsedQuery || []
  }

  isActive = querySegment =>
    !this.disabledFilters[querySegment.text.toLowerCase().trim()]

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
    return this.nlpStore.marks.filter(
      mark => !this.disabledFilters[mark[3].toLowerCase()],
    )
  }

  get hasExclusiveFilters() {
    return Object.keys(this.exclusiveFilters).length
  }

  get uniqueSettings(): Setting[] {
    const intSettings = (
      this.integrationSettingsStore.settingsList || []
    ).filter(x => x.type !== 'setting')
    const unique = uniqBy(intSettings, x => x.type)
    return unique
  }

  get integrationFilters(): SearchFilter[] {
    const { exclusiveFilters } = this
    return this.uniqueSettings.map(setting => ({
      type: setting.type,
      icon: setting.type,
      name: this.integrationSettingsStore.getTitle(setting),
      active: this.hasExclusiveFilters ? exclusiveFilters[setting.type] : true,
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
    const numPeople = this.parsedQuery.filter(x => x.type === MarkType.Person)
      .length
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
      if (!nlp) {
        throw react.cancel
      }
      // reset integration inactive filters
      const { integrations } = nlp
      if (!integrations || !integrations.length) {
        throw react.cancel
      }
      this.exclusiveFilters = this.uniqueSettings.reduce(
        (acc, setting: Setting) => {
          acc[setting.type] = integrations.some(x => x === setting.type)
          return acc
        },
        {},
      )
    },
  )

  resetFiltersOnSearchClear = react(
    () => !!this.queryStore.query,
    hasQuery => {
      if (hasQuery) {
        throw react.cancel
      }
      this.disabledFilters = {}
      this.exclusiveFilters = {}
      this.dateState = {
        startDate: null,
        endDate: null,
      }
    },
  )

  queryHasActiveSegment = name =>
    this.parsedQuery.some(x => x.text.toLowerCase() === name.toLowerCase())

  toggleFilter = (name: string) => {
    // if adding a suggested filter, add it dont disable
    if (!this.queryHasActiveSegment(name)) {
      this.queryStore.setQuery(`${this.queryStore.query} ${name}`.trim())
      return
    }
    const key = name.toLowerCase()
    this.disabledFilters = {
      ...this.disabledFilters,
      [key]: !this.disabledFilters[key],
    }
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
