import { useReaction } from '@mcro/use-store'
import { useCallback } from 'react'
import { useStoresSimple } from '../../../orbit-app/src/hooks/useStores'
import { useFilter, UseFilterProps } from './useFilter'

export function useActiveQueryFilter<A>(props: UseFilterProps<A>): A[] {
  const { appStore } = useStoresSimple()
  const activeQuery = useReaction(() => appStore.activeQuery)
  const sortBy = useCallback(props.sortBy, [])
  return useFilter({
    query: activeQuery,
    ...props,
    // never update this because it should be pure
    sortBy,
  })
}
