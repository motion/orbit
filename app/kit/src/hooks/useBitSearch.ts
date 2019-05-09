import { useModels } from '@o/bridge'
import { Bit, BitContentType, BitModel } from '@o/models'
import { useListProps } from '@o/ui'
import { FindOptions } from 'typeorm'

import { useActiveQuery } from './useActiveQuery'
import { useSearchState } from './useSearchState'

type UseBitsProps = FindOptions<Bit> & {
  type?: BitContentType
  searchable?: boolean
  query?: string
}

export function useBitSearch({ type, ...args }: UseBitsProps = {}) {
  const listProps = useListProps()
  const searchable = typeof args.searchable === 'undefined' ? listProps.searchable : args.searchable
  const activeQuery = useActiveQuery({ delay: 100 })
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
