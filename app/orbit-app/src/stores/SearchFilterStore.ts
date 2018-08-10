import { store, react } from '@mcro/black'
import { SearchStore } from './SearchStore'
import { IntegrationSettingsStore } from './IntegrationSettingsStore'
import { memoize, uniqBy } from 'lodash'
import { MarkType, NLPResponse } from './nlpStore/types'
import { Setting } from '@mcro/models'
import { NLPStore } from './NLPStore'
import { hoverSettler } from '../helpers/hoverSettler'

export type SearchFilter = {
  type: string
  icon: string
  name: string
  active: boolean
}

type DateSelections = {
  startDate?: Date
  endDate?: Date
  key?: string
}

type DateState = {
  ranges: DateSelections[]
}

const suggestedDates = [
  { text: 'Last Week', type: MarkType.Date },
  { text: 'Last Month', type: MarkType.Date },
]

@store
export class SearchFilterStore /* extends Store */ {
  searchStore: SearchStore
  integrationSettingsStore: IntegrationSettingsStore
  nlpStore: NLPStore

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

  constructor(searchStore) {
    this.searchStore = searchStore
    this.integrationSettingsStore = searchStore.props.integrationSettingsStore
    this.nlpStore = searchStore.nlpStore
  }

  willMount() {
    this.dateHover.setOnHovered(target => {
      this.searchStore.setExtraFiltersVisible(target)
    })
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
    const hasDates = this.parsedQuery.some(x => x.type === MarkType.Date)
    const numPeople = this.parsedQuery.filter(x => x.type === MarkType.Person)
      .length
    let suggestions = []
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
      } else {
        this.dateState = this.nlpStore.nlp.date
      }
    },
  )

  resetIntegrationFiltersOnNLPChange = react(
    () => this.searchStore.nlpStore.nlp,
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
    () => !!this.searchStore.query,
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
      this.searchStore.setQuery(`${this.searchStore.query} ${name}`.trim())
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
