import { useObserveMany } from '@mcro/model-bridge'
import { AppType, PersonBitModel } from '@mcro/models'
import { View } from '@mcro/ui'
import * as React from 'react'
import NoResultsDialog from '../../components/NoResultsDialog'
import { removePrefixIfExists } from '../../helpers/removePrefixIfExists'
import { useOrbitFilterableResults } from '../../hooks/useOrbitFilterableResults'
import { ControlButton } from '../../views/ControlButtons'
import SelectableList from '../../views/Lists/SelectableList'
import { TopControls } from '../../views/TopControls'
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
    <>
      <TopControls>
        <View flex={1} />
        <ControlButton icon="funnel">All</ControlButton>
      </TopControls>
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
