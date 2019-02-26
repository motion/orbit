import { useModels } from '@mcro/bridge'
import {
  groupByFirstLetter,
  List,
  removePrefixIfExists,
  useActiveQuery,
  useActiveQueryFilter,
  useShareMenu,
  useStores,
} from '@mcro/kit'
import * as React from 'react'
import NoResultsDialog from '../../views/NoResultsDialog'
import { BitModel } from '@mcro/models'

export function PeopleAppIndex() {
  // people and query
  const { queryStore } = useStores()
  const { sourceFilters } = queryStore.queryFilters
  const { getShareMenuItemProps } = useShareMenu()
  const activeQuery = useActiveQuery()

  let where = []
  if (sourceFilters.length) {
    for (const filter of sourceFilters) {
      if (filter.active) {
        where.push({
          type: 'person',
          sourceType: filter.source // todo: make sure it works
        })
      }
    }
  }
  if (!where.length)
    where.push({ type: 'person' })

  const [people] = useModels(BitModel, { take: 50000, where })
  const results = useActiveQueryFilter({
    items: people,
    filterKey: 'name',
    sortBy: x => x.title.toLowerCase(),
    removePrefix: '@',
  })

  if (!people.length) {
    return <NoResultsDialog subName="the directory" />
  }

  const getItemGroupProps = results.length > 12 ? groupByFirstLetter('name') : () => null

  return (
    <List
      getItemProps={(...args) => {
        return {
          ...getItemGroupProps(...args),
          ...getShareMenuItemProps(...args),
        }
      }}
      minSelected={0}
      items={results}
      query={removePrefixIfExists(activeQuery, '@')}
    />
  )
}
