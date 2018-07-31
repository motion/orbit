import { store, deep, react } from '@mcro/black'
import { SearchStore } from './SearchStore'
import { IntegrationSettingsStore } from './IntegrationSettingsStore'
import { memoize, uniqBy } from 'lodash'
import { NLPResponse } from './nlpStore/types'
import { Setting } from '@mcro/models'
import { App } from '@mcro/stores'
import { NLPStore } from './NLPStore'

export type SearchFilter = {
  type: string
  icon: string
  name: string
  active: boolean
}

const suggestedDates = [
  { name: 'Last Week', type: 'date', active: false },
  { name: 'Last Month', type: 'date', active: false },
]

@store
export class SearchFilterStore /* extends Store */ {
  searchStore: SearchStore
  integrationSettingsStore: IntegrationSettingsStore
  nlpStore: NLPStore
  inactiveFilters = deep({})
  sortBy = 'Relevant'
  sortOptions = ['Relevant', 'Recent']
  disabledMarks = {}

  constructor(searchStore) {
    this.searchStore = searchStore
    this.integrationSettingsStore = searchStore.props.integrationSettingsStore
    this.nlpStore = searchStore.nlpStore
  }

  get hasInactiveFilters() {
    return Object.keys(this.inactiveFilters).length
  }

  get activeFilters() {
    if (this.hasInactiveFilters) {
      return this.filters.filter(x => x.active).map(x => x.type)
    }
    return false
  }

  get uniqueSettings(): Setting[] {
    const intSettings = (
      this.integrationSettingsStore.settingsList || []
    ).filter(x => x.type !== 'setting')
    const unique = uniqBy(intSettings, x => x.type)
    return unique
  }

  get filters(): SearchFilter[] {
    const { /* hasInactiveFilters, */ inactiveFilters } = this
    return this.uniqueSettings.map(setting => ({
      type: setting.type,
      icon: setting.type,
      name: this.integrationSettingsStore.getTitle(setting),
      active: /* !hasInactiveFilters ? true :  */ inactiveFilters[setting.type],
    }))
  }

  get parsedQuery() {
    return this.nlpStore.nlp.parsedQuery
  }

  get suggestedPeople() {
    return this.nlpStore.peopleNames.slice(0, 2).map(name => ({
      name,
      type: 'person',
      active: false,
    }))
  }

  get suggestedFilters() {
    if (!this.parsedQuery) {
      return suggestedDates
    }
    const hasDates = this.parsedQuery.some(
      x => x.type === this.nlpStore.types.DATE,
    )
    const hasPeople = this.parsedQuery.some(
      x => x.type === this.nlpStore.types.PERSON,
    )
    const hasIntegrations = this.parsedQuery.some(
      x => x.type === this.nlpStore.types.INTEGRATION,
    )
    let suggestions = []
    if (!hasDates) {
      suggestions = [...suggestions, ...suggestedDates]
    }
    if (!hasPeople) {
      suggestions = [...suggestions, ...this.suggestedPeople]
    }
    if (!hasIntegrations) {
      suggestions = [...suggestions, ...this.filters.slice(0, 2)]
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

  get filterBarFilters() {
    return [...this.nlpActiveFilters, ...this.suggestedFilters]
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
      this.inactiveFilters = this.uniqueSettings.reduce(
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
      this.disabledMarks = {}
    },
  )

  toggleFilter = name => {
    const disableIndex = this.nlpStore.nlp.parsedQuery.findIndex(
      x => x.text === name,
    )
    this.disabledMarks = {
      ...this.disabledMarks,
      [disableIndex]: !this.disabledMarks[disableIndex],
    }
  }

  resetInactiveFiltersOnEmptySearch = react(
    () => !!App.state.query,
    hasQuery => {
      if (hasQuery) {
        throw react.cancel
      }
      this.inactiveFilters = {}
    },
  )

  toggleSortBy = () => {
    const cur = this.sortOptions.indexOf(this.sortBy)
    this.sortBy = this.sortOptions[(cur + 1) % this.sortOptions.length]
  }

  integrationFilterToggler = memoize((filter: SearchFilter) => {
    return () => this.toggleIntegrationFilter(filter)
  })

  toggleIntegrationFilter = (filter: SearchFilter) => {
    this.inactiveFilters[filter.type] = !this.inactiveFilters[filter.type]
  }
}
