import { useContext, useEffect } from 'react'
import { StoreContext } from '@mcro/black'

export function useResults(results: any[], isActiveOverride?: boolean) {
  const { appStore } = useContext(StoreContext)
  const isActive = typeof isActiveOverride === 'boolean' ? isActiveOverride : appStore.isActive

  useEffect(
    () => {
      if (isActive) {
        appStore.setResults([{ type: 'column', indices: results.map((_, index) => index) }])
      }
    },
    [isActive],
  )
}
