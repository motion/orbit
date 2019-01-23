import { useObserveMany } from '@mcro/model-bridge'
import { AppType, PersonBitModel } from '@mcro/models'
import { View } from '@mcro/ui'
import * as React from 'react'
import NoResultsDialog from '../../components/NoResultsDialog'
import OrbitFilterIntegrationButton from '../../components/OrbitFilterIntegrationButton'
import { removePrefixIfExists } from '../../helpers/removePrefixIfExists'
import { useOrbitFilterableResults } from '../../hooks/useOrbitFilterableResults'
import { FloatingBar } from '../../views/FloatingBar/FloatingBar'
import SelectableList from '../../views/Lists/SelectableList'
import { AppProps } from '../AppProps'

export default function PeopleAppIndex(props: AppProps<AppType.people>) {
  // people and query
  const people = useObserveMany(PersonBitModel, { take: 100000, where: { hasSlack: true } })
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
      <FloatingBar>
        <View flex={1} />
        <OrbitFilterIntegrationButton />
      </FloatingBar>
      <SelectableList
        defaultSelected={0}
        items={results}
        query={removePrefixIfExists(props.appStore.activeQuery, '@')}
        itemProps={props.itemProps}
        maxHeight={props.appStore.maxHeight}
        rowCount={results.length}
      />
    </>
  )
}
