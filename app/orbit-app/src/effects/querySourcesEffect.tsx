import { useActiveDataApps } from '@o/kit'
import { useEffect } from 'react'

import { useStoresSimple } from '../hooks/useStores'

export function querySourcesEffect() {
  const { queryStore } = useStoresSimple()
  const syncApps = useActiveDataApps()
  const sources = syncApps.map(x => ({
    name: x.name,
    type: x.identifier,
  }))
  useEffect(() => {
    queryStore.setSources(sources)
  }, [JSON.stringify(sources)])
}
