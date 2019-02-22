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
import { PersonBitModel } from '@mcro/models'
import { capitalize } from 'lodash'
import * as React from 'react'
import NoResultsDialog from '../../views/NoResultsDialog'

export function PeopleAppIndex() {
  // people and query
  const { queryStore } = useStores()
  const { sourceFilters } = queryStore.queryFilters
  const { getShareMenuItemProps } = useShareMenu()
  const activeQuery = useActiveQuery()

  let where = null
  if (sourceFilters.length) {
    for (const filter of sourceFilters) {
      if (filter.active) {
        where = where || []
        where.push({
          [`has${capitalize(filter.source)}`]: true,
        })
      }
    }
  }

  const [people] = useModels(PersonBitModel, { take: 50000, where })
  const results = useActiveQueryFilter({
    items: people,
    filterKey: 'name',
    sortBy: x => x.name.toLowerCase(),
    removePrefix: '@',
  })

  if (!people.length) {
    return <NoResultsDialog subName="the directory" />
  }

  const getItemGroupProps = results.length > 12 ? groupByFirstLetter('name') : _ => null

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
