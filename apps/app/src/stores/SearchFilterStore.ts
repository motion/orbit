import { store, deep, react } from '@mcro/black'
import { SearchStore } from './SearchStore'
import { IntegrationSettingsStore } from './IntegrationSettingsStore'
import { memoize, uniqBy } from 'lodash'
import { NLPResponse } from './nlpStore/types'
import { Setting } from '@mcro/models'
import { App } from '@mcro/stores'
import { NLPStore } from './NLPStore'
import { MarkType } from './nlpStore/types'

export type SearchFilter = {
  type: string
  icon: string
  name: string
  active: boolean
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
  exclusiveFilters = deep({})
  sortBy = 'Relevant'
  sortOptions = ['Relevant', 'Recent']

  constructor(searchStore) {
    this.searchStore = searchStore
    this.integrationSettingsStore = searchStore.props.integrationSettingsStore
    this.nlpStore = searchStore.nlpStore
  }

  // this contains the segments we found via nlp in order of search
  // like [{ text: 'hey' }, { text: 'world', type: 'integration }]
  get parsedQuery() {
    return this.nlpStore.nlp.parsedQuery || []
  }

  // allows back in text segments that aren't filtered
  get activeQuery() {
    return this.parsedQuery
      .filter(x => !x.type || this.disabledFilters[x.text])
      .map(x => x.text.trim())
      .join(' ')
      .trim()
  }

  get activeFilters() {
    return this.parsedQuery.filter(x => x.type && !this.disabledFilters[x.text])
  }

  get inactiveFilters() {
    return this.parsedQuery.filter(x => this.disabledFilters[x.text])
  }

  get activeDate() {
    // allows disabling date
    for (const part of this.parsedQuery) {
      if (part.type === MarkType.Date) {
        if (this.disabledFilters[part.text]) {
          return {
            startDate: null,
            endDate: null,
          }
        }
      }
    }
    return this.nlpStore.nlp.date
  }

  get activeMarks() {
    if (!this.nlpStore.marks) {
      return null
    }
    return this.nlpStore.marks.filter(mark => !this.disabledFilters[mark[3]])
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

  get activeIntegrationFilters() {
    if (this.hasExclusiveFilters) {
      return this.integrationFilters.filter(x => x.active).map(x => x.type)
    }
    return false
  }

  get integrationFilters(): SearchFilter[] {
    const { exclusiveFilters } = this
    return this.uniqueSettings.map(setting => ({
      type: setting.type,
      icon: setting.type,
      name: this.integrationSettingsStore.getTitle(setting),
      active: exclusiveFilters[setting.type],
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
    const hasPeople = this.parsedQuery.some(x => x.type === MarkType.Person)
    let suggestions = []
    if (!hasDates) {
      suggestions = [...suggestions, ...suggestedDates]
    }
    if (!hasPeople) {
      suggestions = [...suggestions, ...this.suggestedPeople]
    }
    return suggestions
  }

  // includes nlp parsed segments + suggested other segments
  get nlpActiveFilters() {
    return (this.parsedQuery || []).filter(x => !!x.type).map(part => ({
      name: part.text,
      type: part.type,
      active: true,
    }))
  }

  resetIntegrationFiltersOnNLPChange = react(
    () => this.searchStore.nlpStore.nlp,
    (nlp: NLPResponse) => {
      if (!nlp) {
        throw react.cancel
      }
      // reset integration inactive filters
      const { integrations } = nlp
      if (!integrations.length) {
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

  resetDisabledFiltersOnSearchClear = react(
    () => !!this.searchStore.searchState.query,
    hasQuery => {
      if (hasQuery) {
        throw react.cancel
      }
      this.disabledFilters = {}
    },
  )

  toggleFilter = (name: string) => {
    this.disabledFilters = {
      ...this.disabledFilters,
      [name]: !this.disabledFilters[name],
    }
  }

  resetInactiveFiltersOnEmptySearch = react(
    () => !!App.state.query,
    hasQuery => {
      if (hasQuery) {
        throw react.cancel
      }
      this.disabledFilters = {}
    },
  )

  toggleSortBy = () => {
    const cur = this.sortOptions.indexOf(this.sortBy)
    this.sortBy = this.sortOptions[(cur + 1) % this.sortOptions.length]
  }

  integrationFilterToggler = memoize((filter: SearchFilter) => {
    return () => this.toggleExclusiveFilter(filter)
  })

  toggleExclusiveFilter = (filter: SearchFilter) => {
    this.exclusiveFilters[filter.type] = !this.exclusiveFilters[filter.type]
  }
}
