import { useActiveSyncApps } from '@o/kit'
import { useEffect } from 'react'
import { useStoresSimple } from '../hooks/useStores'

export function querySourcesEffect() {
  const { queryStore } = useStoresSimple()
  const syncApps = useActiveSyncApps()
  useEffect(
    () => {
      queryStore.setSources(
        syncApps.map(x => ({
          name: x.name,
          type: x.identifier,
        })),
      )
    },
    [syncApps],
  )
}
