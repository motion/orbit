import * as React from 'react'
import { useObserveMany } from '@mcro/model-bridge'
import { PersonBitModel, AppType } from '@mcro/models'
import NoResultsDialog from '../../components/NoResultsDialog'
import { AppProps } from '../AppProps'
import { OrbitList } from '../../views/Lists/OrbitList'
import { observer } from 'mobx-react-lite'
import { Selectable } from '../../components/Selectable'
import { removePrefixIfExists } from '../../helpers/removePrefixIfExists'
import { useOrbitFilterableResults } from '../../hooks/useOrbitFilterableResults'

// export default observer(function PeopleAppIndex(props: AppProps<AppType.people>) {
export default observer(function PeopleAppIndex(props: AppProps<AppType.people>) {
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
    <Selectable items={results}>
      <OrbitList
        items={results}
        query={removePrefixIfExists(props.appStore.activeQuery, '@')}
        itemProps={props.itemProps}
        maxHeight={props.appStore.maxHeight}
        rowCount={results.length}
        onSelect={props.onSelectItem}
        onOpen={props.onOpenItem}
      />
    </Selectable>
  )
})
