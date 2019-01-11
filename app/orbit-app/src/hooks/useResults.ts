import { useContext, useEffect } from 'react'
import { StoreContext } from '@mcro/black'
import { useComputed } from 'mobx-react-lite'

export function useResults(results: any[], isActiveOverride?: boolean) {
  const { appStore, selectionStore } = useContext(StoreContext)
  const isActive = useComputed(() =>
    typeof isActiveOverride === 'boolean' ? isActiveOverride : !!appStore.isActive,
  )

  useEffect(
    () => {
      if (isActive) {
        appStore.setResults([{ type: 'column', indices: results.map((_, index) => index) }])
      }
      // auto select first result
      if (selectionStore) {
        selectionStore.setActiveIndex(0)
      }
    },
    [isActive],
  )
}
