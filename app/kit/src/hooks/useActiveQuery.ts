import { ReactionOptions } from '@o/automagical'
import { useVisibilityStore } from '@o/ui'
import { ensure, useReaction } from '@o/use-store'

import { useStoresSimple } from './useStores'

export function useActiveQuery(opts?: ReactionOptions): string {
  const { queryStore } = useStoresSimple()
  const visibleStore = useVisibilityStore()
  return useReaction(
    () => {
      ensure('visible', visibleStore.visible)
      ensure('queryStore', !!queryStore)
      return queryStore.query
    },
    {
      name: 'useActiveQuery',
      defaultValue: '',
      ...opts,
    },
  )
}
