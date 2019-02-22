import { useModels } from '@mcro/bridge'
import {
  AppProps,
  groupByFirstLetter,
  List,
  removePrefixIfExists,
  useActiveQueryFilter,
  useShareMenu,
  useStores,
} from '@mcro/kit'
import { PersonBitModel } from '@mcro/models'
import { capitalize } from 'lodash'
import * as React from 'react'
import NoResultsDialog from '../../views/NoResultsDialog'

export function PeopleAppIndex(props: AppProps) {
  // people and query
  const { queryStore } = useStores()
  const { integrationFilters } = queryStore.queryFilters
  const { getShareMenuItemProps } = useShareMenu()

  let where = null
  if (integrationFilters.length) {
    for (const filter of integrationFilters) {
      if (filter.active) {
        where = where || []
        where.push({
          [`has${capitalize(filter.integration)}`]: true,
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
      query={removePrefixIfExists(props.appStore.activeQuery, '@')}
    />
  )
}
