import { useModels } from '@o/bridge'
import { Bit, BitContentType, BitModel } from '@o/models'
import { useReaction } from '@o/use-store'
import { useContext } from 'react'
import { FindOptions } from 'typeorm'
import { ListPropsContext } from '../views/List'
import { useSearchState } from './useSearchState'
import { useStoresSimple } from './useStores'

type UseBitsProps = FindOptions<Bit> & {
  type?: BitContentType
  searchable?: boolean
  query?: string
}

export function useBits({ type, ...args }: UseBitsProps = {}) {
  const listProps = useContext(ListPropsContext)
  const searchable = typeof args.searchable === 'undefined' ? listProps.searchable : args.searchable
  const { appStore } = useStoresSimple()
  const activeQuery = useReaction(() => appStore.activeQuery, { delay: 100, defaultValue: '' })
  const query = searchable ? activeQuery : args.query

  const { queryFilters } = useSearchState()
  let where = []
  let take = typeof args.take === 'undefined' ? 5000 : args.take

  if (type) {
    const { appFilters } = queryFilters
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

  console.log('finalArgs', finalArgs)

  return useModels(BitModel, finalArgs)[0]
}
