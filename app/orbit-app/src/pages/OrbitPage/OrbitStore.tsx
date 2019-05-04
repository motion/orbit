import { useHook } from '@o/use-store'

import { useStoresSimple } from '../../hooks/useStores'

export class OrbitStore {
  stores = useHook(useStoresSimple)

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
