import { useModels } from '@o/bridge'
import { Bit, BitContentType, BitModel } from '@o/models'
import { useListProps } from '@o/ui'
import { isDefined } from '@o/utils'
import { FindOptions } from 'typeorm'

import { useActiveQuery } from './useActiveQuery'
import { useSearchState } from './useSearchState'

type UseBitsProps = FindOptions<Bit> & {
  type?: BitContentType
  searchable?: boolean
  query?: string
  delay?: number
}

export function useBitSearch({ type, delay = 100, where, ...args }: UseBitsProps = {}) {
  const listProps = useListProps()
  const searchable = typeof args.searchable === 'undefined' ? listProps.searchable : args.searchable
  const activeQuery = useActiveQuery({ delay })
  const query = searchable ? activeQuery : args.query

  const state = useSearchState()
  const { appFilters } = state.filters
  let whereFinal = []
  let take = typeof args.take === 'undefined' ? 5000 : args.take

  // TODO exclusive/inclusive
  if (appFilters && appFilters.length) {
    for (const filter of appFilters) {
      if (filter.active) {
        whereFinal.push({
          ...where,
          type,
          appIdentifier: filter.app,
        })
      }
    }
  }

  if (isDefined(query)) {
    whereFinal = whereFinal.map(condition => {
      return {
        ...where,
        ...condition,
        title: { $like: `%${query}%` },
      }
    })
  }

  if (isDefined(where)) {
    whereFinal.push(where)
  }

  const finalArgs = {
    ...args,
    where: whereFinal,
    take,
  }

  return useModels(BitModel, finalArgs)[0]
}
