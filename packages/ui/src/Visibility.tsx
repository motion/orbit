import { createStoreContext } from '@o/use-store'
import { selectDefined } from '@o/utils'
import { useContext } from 'react'

class VisibilityStore {
  props: { visible: boolean } = {
    visible: true,
  }

  getVisible = () => {
    return this.props.visible
  }
}

const context = createStoreContext(VisibilityStore)
export const ProvideVisibility = context.Provider

export const Visibility = context.Provider
export const useVisibilityContext = () => useContext(context.Context) || { getVisible: () => true }

export function useVisibility() {
  // support may not be provided
  try {
    const store = context.useStore()
    return selectDefined(store.getVisible(), true)
  } catch {
    // no visibility store
    return true
  }
}
