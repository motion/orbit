import { useEffect } from 'react'
import { useComputed } from 'mobx-react-lite'
import { useStoresSafe } from './useStoresSafe'

export function useResults(results: any[], isActiveOverride?: boolean) {
  const { appStore } = useStoresSafe({ optional: ['selectionStore'] })
  const isActive = useComputed(() =>
    typeof isActiveOverride === 'boolean' ? isActiveOverride : !!appStore.isActive,
  )

  useEffect(
    () => {
      if (isActive) {
        appStore.setResults([{ type: 'column', indices: results.map((_, index) => index) }])
      }
    },
    [isActive],
  )
}
