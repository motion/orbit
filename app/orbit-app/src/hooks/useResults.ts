import { useContext, useEffect } from 'react'
import { StoreContext } from '@mcro/black'

export function useResults(results: any[], isActive: boolean) {
  const { appStore } = useContext(StoreContext)

  useEffect(
    () => {
      if (isActive) {
        appStore.setResults([{ type: 'column', indices: results.map((_, index) => index) }])
      }
    },
    [isActive],
  )
}
