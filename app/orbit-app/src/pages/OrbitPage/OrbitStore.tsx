import { AppStore } from '@o/kit'

export class OrbitStore {
  activeActions = null
  showAppSettings = false
  activeAppStore: AppStore = null

  setActiveAppStore = (next: AppStore) => {
    this.activeAppStore = next
  }

  toggleShowAppSettings = () => {
    this.showAppSettings = !this.showAppSettings
  }

  setActiveActions = next => {
    this.activeActions = next
  }
}
