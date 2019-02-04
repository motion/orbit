import { useObserveMany } from '@mcro/model-bridge'
import { AppType, PersonBitModel } from '@mcro/models'
import { Text, View } from '@mcro/ui'
import { capitalize } from 'lodash'
import { observer } from 'mobx-react-lite'
import pluralize from 'pluralize'
import * as React from 'react'
import NoResultsDialog from '../../components/NoResultsDialog'
import OrbitFilterIntegrationButton from '../../components/OrbitFilterIntegrationButton'
import { groupByLetter } from '../../helpers/groupByFirstLetter'
import { removePrefixIfExists } from '../../helpers/removePrefixIfExists'
import { useOrbitFilterableResults } from '../../hooks/useOrbitFilterableResults'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { FloatingBar } from '../../views/FloatingBar/FloatingBar'
import SelectableList from '../../views/Lists/SelectableList'
import { AppProps } from '../AppProps'

export default observer(function PeopleAppIndex(props: AppProps<AppType.people>) {
  // people and query
  const { queryStore } = useStoresSafe()
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

  const people = useObserveMany(PersonBitModel, { take: 50000, where })
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
    <>
      <FloatingBar>
        <Text fontWeight={500} alpha={0.6} size={0.9}>
          {people.length} {pluralize('people', people.length)}{' '}
          {hasIntegrationFilters ? ` (filtered)` : ''}
        </Text>
        <View flex={1} />
        <OrbitFilterIntegrationButton />
      </FloatingBar>
      <SelectableList
        key={0}
        getItemProps={results.length > 12 ? groupByLetter('name') : null}
        minSelected={0}
        items={results}
        query={removePrefixIfExists(props.appStore.activeQuery, '@')}
      />
    </>
  )
})
