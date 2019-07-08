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
  excludeData?: boolean
}

export function useBitSearch({
  type,
  delay = 100,
  where,
  // prevent excessive take
  take = 5000,
  excludeData,
  ...args
}: UseBitsProps = {}) {
  const listProps = useListProps()
  const searchable = typeof args.searchable === 'undefined' ? listProps.searchable : args.searchable
  const activeQuery = useActiveQuery({ delay })
  const query = searchable ? activeQuery : args.query
  const state = useSearchState()
  let whereFinal = []

  if (state) {
    const { appFilters } = state.filters

    // add filters
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

    // add search query
    if (isDefined(query)) {
      whereFinal = whereFinal.map(condition => {
        return {
          ...where,
          ...condition,
          type,
          title: { $like: `%${query}%` },
        }
      })
    }

    // add where, account for type
    if (isDefined(where)) {
      if (Array.isArray(where)) {
        whereFinal = [...whereFinal, where.map(x => ({ type, ...x }))]
      } else {
        whereFinal.push({
          type,
          ...where,
        })
      }
    } else if (type) {
      whereFinal.push({ type })
    }
  }

  if (excludeData) {
    args.select = bitSelectAllButData
  }

  let finalArgs: FindOptions<Bit> = {
    ...args,
    take,
  }

  // only add if necessary
  if (whereFinal.length) {
    finalArgs.where = whereFinal
  }

  return useModels(BitModel, finalArgs)[0]
}

export const bitSelectAllButData: (keyof Bit)[] = [
  'id',
  'appIdentifier',
  'appId',
  'author',
  'authorId',
  'bitCreatedAt',
  'bitUpdatedAt',
  'body',
  'contentHash',
  'crawled',
  'createdAt',
  'desktopLink',
  'email',
  'originalId',
  'photo',
  'webLink',
  'updatedAt',
  'title',
  'type',
]
