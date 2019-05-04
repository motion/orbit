import { useModels } from '@o/bridge'
import { Bit, BitContentType, BitModel } from '@o/models'
import { useListProps } from '@o/ui'
import { useReaction } from '@o/use-store'
import { FindOptions } from 'typeorm'

import { useSearchState } from './useSearchState'
import { useStoresSimple } from './useStores'

type UseBitsProps = FindOptions<Bit> & {
  type?: BitContentType
  searchable?: boolean
  query?: string
}

export function useBits({ type, ...args }: UseBitsProps = {}) {
  const listProps = useListProps()
  const searchable = typeof args.searchable === 'undefined' ? listProps.searchable : args.searchable
  const { appStore } = useStoresSimple()
  const activeQuery = useReaction(() => appStore.activeQuery, { delay: 100, defaultValue: '' })
  const query = searchable ? activeQuery : args.query

  const state = useSearchState()
  let where = []
  let take = typeof args.take === 'undefined' ? 5000 : args.take

  if (type) {
    const { appFilters } = state.filters
    if (appFilters.length) {
      for (const filter of appFilters) {
        if (filter.active) {
          where.push({
            type: 'person',
            appIdentifier: filter.app,
          })
        }
      }
    }
    if (!where.length) {
      where.push({ type: 'person' })
    }
  }

  if (typeof query !== 'undefined' && query) {
    where = where.map(condition => {
      return {
        ...condition,
        title: { $like: `%${query}%` },
      }
    })
  }

  const finalArgs = { ...args, take, where }

  return useModels(BitModel, finalArgs)[0]
}
