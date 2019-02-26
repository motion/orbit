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
import { BitModel } from '@mcro/models'
import * as React from 'react'
import NoResultsDialog from '../../views/NoResultsDialog'

export function PeopleAppIndex() {
  // people and query
  const { queryStore } = useStores()
  const { appFilters } = queryStore.queryFilters
  const { getShareMenuItemProps } = useShareMenu()
  const activeQuery = useActiveQuery()

  let where = []
  if (appFilters.length) {
    for (const filter of appFilters) {
      if (filter.active) {
        where.push({
          type: 'person',
          identifier: filter.app, // todo: make sure it works
        })
      }
    }
  }
  if (!where.length) where.push({ type: 'person' })

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
      getItemProps={(a, b, c) => {
        return {
          ...getItemGroupProps(a, b, c),
          ...getShareMenuItemProps(a, b, c),
        }
      }}
      minSelected={0}
      items={results}
      query={removePrefixIfExists(activeQuery, '@')}
    />
  )
}
