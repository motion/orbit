import { store } from '@mcro/black'

@store
export class SearchFilterStore {
  get settings() {
    // @ts-ignore
    return this.props.integrationSettingsStore.settings
  }

  get filters() {
    if (!this.settings) {
      return null
    }
    return this.settings.map(x => x.type)
  }
}
