import * as React from 'react'
import { useObserveMany } from '@mcro/model-bridge'
import { PersonBitModel, AppType } from '@mcro/models'
import NoResultsDialog from '../../components/NoResultsDialog'
import { AppProps } from '../AppProps'
import { removePrefixIfExists } from '../../helpers/removePrefixIfExists'
import { useOrbitFilterableResults } from '../../hooks/useOrbitFilterableResults'
import SelectableList from '../../views/Lists/SelectableList'

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

  return (
    <SelectableList
      items={results}
      query={removePrefixIfExists(props.appStore.activeQuery, '@')}
      itemProps={props.itemProps}
      maxHeight={props.appStore.maxHeight}
      rowCount={results.length}
      onSelect={props.onSelectItem}
      onOpen={props.onOpenItem}
    />
  )
}
