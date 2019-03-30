import { createStoreContext, useStore } from '@o/use-store'
import React from 'react'

class VisibilityStore {
  props: { visible: boolean }
}

const { Provider, useStore: useVisiblityStore } = createStoreContext(VisibilityStore)

export function Visibility({ visible, children }: { visible: boolean; children: any }) {
  const store = useStore(VisibilityStore, { visible })
  return <Provider value={store}>{children}</Provider>
}

export function useVisiblity() {
  const store = useVisiblityStore()
  return store ? store.props.visible : true
}
