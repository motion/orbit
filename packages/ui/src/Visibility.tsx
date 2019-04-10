import { createStoreContext, useStore } from '@o/use-store'
import { selectDefined } from '@o/utils'
import React, { useContext } from 'react'

class VisibilityStore {
  props: { visible: boolean }

  getVisible() {
    return this.props.visible
  }
}

const { Context, Provider, useStore: useVisibilityStore } = createStoreContext(VisibilityStore)

export function Visibility({ visible, children }: { visible: boolean; children: any }) {
  const store = useStore(VisibilityStore, { visible })
  return <Provider value={store}>{children}</Provider>
}

export function useVisibilityContext() {
  return useContext(Context) || { getVisible: () => true }
}

export function useVisibility() {
  try {
    const store = useVisibilityStore()
    return selectDefined(store.getVisible(), true)
  } catch {
    console.warn('catching error with visibility')
    return true
  }
}
