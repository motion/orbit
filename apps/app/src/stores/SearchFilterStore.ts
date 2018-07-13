import { store } from '@mcro/black'
import { IntegrationSettingsStore } from './IntegrationSettingsStore'

@store
export class SearchFilterStore {
  integrationSettingsStore?: IntegrationSettingsStore = null

  get settings() {
    if (!this.integrationSettingsStore) {
      return null
    }
    return this.integrationSettingsStore.settingsList
  }

  get filters() {
    if (!this.settings) {
      return null
    }
    return this.settings.map(x => x.type)
  }
}
