import { PersonBitModel } from '@mcro/models'
import { capitalize } from 'lodash'
import * as React from 'react'
import NoResultsDialog from '../../components/NoResultsDialog'
import { groupByLetter } from '../../helpers/groupByFirstLetter'
import { removePrefixIfExists } from '../../helpers/removePrefixIfExists'
import { useOrbitFilterableResults } from '../../hooks/useOrbitFilterableResults'
import { useStores } from '../../hooks/useStores'
import { useModels } from '../../useModel'
import SelectableList from '../../views/Lists/SelectableList'
import { AppProps } from '../AppTypes'

export default function PeopleAppIndex(props: AppProps) {
  // people and query
  const { queryStore } = useStores()
  const { hasIntegrationFilters, integrationFilters } = queryStore.queryFilters

  let where = null
  if (hasIntegrationFilters) {
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
  const results = useOrbitFilterableResults({
    items: people,
    filterKey: 'name',
    sortBy: x => x.name.toLowerCase(),
    removePrefix: '@',
  })

  if (!people.length) {
    return <NoResultsDialog subName="the directory" />
  }

  return (
    <SelectableList
      getItemProps={results.length > 12 ? groupByLetter('name') : null}
      minSelected={0}
      items={results}
      query={removePrefixIfExists(props.appStore.activeQuery, '@')}
    />
  )
}
