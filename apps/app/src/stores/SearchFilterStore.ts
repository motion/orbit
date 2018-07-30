import { store, deep, react } from '@mcro/black'
import { SearchStore } from './SearchStore'
import { IntegrationSettingsStore } from './IntegrationSettingsStore'
import { memoize, uniqBy } from 'lodash'
import { NLPResponse } from './nlpStore/types'
import { Setting } from '@mcro/models'
import { App } from '@mcro/stores'

export type SearchFilter = {
  type: string
  icon: string
  name: string
  active: boolean
}

@store
export class SearchFilterStore /* extends Store */ {
  searchStore: SearchStore
  integrationSettingsStore: IntegrationSettingsStore
  inactiveFilters = deep({})
  sortBy = 'Relevant'
  sortOptions = ['Relevant', 'Recent']

  constructor(searchStore) {
    // super()
    this.searchStore = searchStore
    this.integrationSettingsStore = searchStore.props.integrationSettingsStore
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

  updateFiltersOnNLP = react(
    () => this.searchStore.nlpStore.nlp,
    (nlp: NLPResponse) => {
      if (!nlp) {
        throw react.cancel
      }
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

  filterToggler = memoize((filter: SearchFilter) => {
    return () => this.toggleFilter(filter)
  })

  toggleFilter = (filter: SearchFilter) => {
    this.inactiveFilters[filter.type] = !this.inactiveFilters[filter.type]
  }
}
