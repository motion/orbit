import { createStoreContext, useStore } from '@o/use-store'
import React, { useContext } from 'react'

class VisibilityStore {
  props: { visible: boolean }

  get visible() {
    return this.props.visible
  }
}

const { Context, Provider, useStore: useVisiblityStore } = createStoreContext(VisibilityStore)

export function Visibility({ visible, children }: { visible: boolean; children: any }) {
  const store = useStore(VisibilityStore, { visible })
  return <Provider value={store}>{children}</Provider>
}

export function useVisiblityContext() {
  return useContext(Context) || { visible: true }
}

export function useVisiblity() {
  const store = useVisiblityStore()
  return store ? store.visible : true
}
