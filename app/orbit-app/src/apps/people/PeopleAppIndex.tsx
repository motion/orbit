import { useObserveMany } from '@mcro/model-bridge'
import { AppType, PersonBitModel } from '@mcro/models'
import { Text } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import pluralize from 'pluralize'
import * as React from 'react'
import NoResultsDialog from '../../components/NoResultsDialog'
import OrbitFilterIntegrationButton from '../../components/OrbitFilterIntegrationButton'
import { OrbitToolbar } from '../../components/OrbitToolbar'
import { removePrefixIfExists } from '../../helpers/removePrefixIfExists'
import { useOrbitFilterableResults } from '../../hooks/useOrbitFilterableResults'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { HorizontalSpace } from '../../views'
import SelectableList from '../../views/Lists/SelectableList'
import { AppProps } from '../AppProps'

export default observer(function PeopleAppIndex(props: AppProps<AppType.people>) {
  // people and query
  const people = useObserveMany(PersonBitModel, { take: 100000, where: { hasSlack: true } })
  const { queryStore } = useStoresSafe()
  const { queryFilters } = queryStore
  const results = useOrbitFilterableResults({
    items: people,
    filterKey: 'name',
    sortBy: x => x.name.toLowerCase(),
    removePrefix: '@',
    groupByLetter: true,
  })

  if (!people.length) {
    return <NoResultsDialog subName="the directory" />
  }

  return (
    <>
      <OrbitToolbar
        before={
          <>
            <OrbitFilterIntegrationButton />
            <HorizontalSpace />
            <Text fontWeight={500} alpha={0.6} size={0.9}>
              {people.length} {pluralize('people', people.length)}{' '}
              {queryFilters.hasIntegrationFilters ? ` (filtered)` : ''}
            </Text>
          </>
        }
      />
      <SelectableList
        minSelected={0}
        items={results}
        query={removePrefixIfExists(props.appStore.activeQuery, '@')}
        itemProps={props.itemProps}
        maxHeight={props.appStore.maxHeight}
        rowCount={results.length}
      />
    </>
  )
})
