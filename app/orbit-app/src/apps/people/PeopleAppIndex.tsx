import { useObserveMany } from '@mcro/model-bridge'
import { AppType, PersonBitModel } from '@mcro/models'
import * as React from 'react'
import NoResultsDialog from '../../components/NoResultsDialog'
import { removePrefixIfExists } from '../../helpers/removePrefixIfExists'
import { useOrbitFilterableResults } from '../../hooks/useOrbitFilterableResults'
import SelectableList from '../../views/Lists/SelectableList'
import { AppProps } from '../AppProps'

export default function PeopleAppIndex(props: AppProps<AppType.people>) {
  // people and query
  const people = useObserveMany(PersonBitModel, { take: 10000 })
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

  console.log('render people index...')

  return (
    <SelectableList
      defaultSelected={0}
      items={results}
      query={removePrefixIfExists(props.appStore.activeQuery, '@')}
      itemProps={props.itemProps}
      maxHeight={props.appStore.maxHeight}
      rowCount={results.length}
    />
  )
}
