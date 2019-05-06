export class OrbitStore {
  isEditing = false
  activeActions = null
  showAppSettings = false

  toggleShowAppSettings = () => {
    this.showAppSettings = !this.showAppSettings
  }

  get isTorn() {
    return false
  }

  setEditing = () => {
    this.isEditing = true
  }

  setActiveActions = next => {
    this.activeActions = next
  }
}
