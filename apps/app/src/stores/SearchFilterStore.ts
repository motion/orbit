import { store, deep, react, Store } from '@mcro/black'
import { SearchStore } from './SearchStore'
import { IntegrationSettingsStore } from './IntegrationSettingsStore'
import { memoize } from 'lodash'
import { NLPResponse } from './nlpStore/types'
import { Setting } from '@mcro/models'

export type SearchFilter = {
  type: string
  icon: string
  name: string
  active: boolean
}

@store
export class SearchFilterStore extends Store {
  searchStore: SearchStore
  integrationSettingsStore: IntegrationSettingsStore
  inactiveFilters = deep({})

  constructor(searchStore) {
    super()
    this.searchStore = searchStore
    this.integrationSettingsStore = searchStore.props.integrationSettingsStore
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
      this.inactiveFilters = this.integrationSettingsStore.settingsList.reduce(
        (acc, setting: Setting) => {
          acc[setting.type] = integrations.some(x => x === setting.type)
          return acc
        },
        {},
      )
    },
  )

  get hasInactiveFilters() {
    return Object.keys(this.inactiveFilters).length
  }

  get activeFilters() {
    if (this.hasInactiveFilters) {
      return this.filters.filter(x => x.active).map(x => x.type)
    }
    return false
  }

  get settings() {
    return this.integrationSettingsStore.settingsList
  }

  get filters(): SearchFilter[] {
    const { settingsList, getTitle } = this.integrationSettingsStore
    if (!settingsList) {
      return []
    }
    const { /* hasInactiveFilters, */ inactiveFilters } = this
    return settingsList.filter(x => x.type !== 'setting').map(setting => ({
      type: setting.type,
      icon: setting.type,
      name: getTitle(setting),
      active: /* !hasInactiveFilters ? true :  */ inactiveFilters[setting.type],
    }))
  }

  filterToggler = memoize((filter: SearchFilter) => {
    return () => this.toggleFilter(filter)
  })

  toggleFilter = (filter: SearchFilter) => {
    this.inactiveFilters[filter.type] = !this.inactiveFilters[filter.type]
  }
}
