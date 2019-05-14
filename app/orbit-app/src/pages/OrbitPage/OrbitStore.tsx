export class OrbitStore {
  activeActions = null
  showAppSettings = false

  toggleShowAppSettings = () => {
    this.showAppSettings = !this.showAppSettings
  }

  setActiveActions = next => {
    this.activeActions = next
  }
}
