import { store, deep } from '@mcro/black'
import { SearchStore } from './SearchStore'
import { IntegrationSettingsStore } from './IntegrationSettingsStore'
import { memoize } from 'lodash'

export type SearchFilter = {
  type: string
  icon: string
  name: string
  active: boolean
}

@store
export class SearchFilterStore {
  searchStore: SearchStore
  integrationSettingsStore: IntegrationSettingsStore
  inactiveFilters = deep({})

  constructor(searchStore) {
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

  get settings() {
    return this.integrationSettingsStore.settingsList
  }

  get filters(): SearchFilter[] {
    const { settingsList, getTitle } = this.integrationSettingsStore
    if (!settingsList) {
      return []
    }
    const { hasInactiveFilters, inactiveFilters } = this
    return settingsList.filter(x => x.type !== 'setting').map(setting => ({
      type: setting.type,
      icon: setting.type,
      name: getTitle(setting),
      active: !hasInactiveFilters ? true : inactiveFilters[setting.type],
    }))
  }

  filterToggler = memoize((filter: SearchFilter) => {
    return () => this.toggleFilter(filter)
  })

  toggleFilter = (filter: SearchFilter) => {
    this.inactiveFilters[filter.type] = !this.inactiveFilters[filter.type]
  }
}
