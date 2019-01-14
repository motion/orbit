import * as React from 'react'
import { useObserveMany } from '@mcro/model-bridge'
import { sortBy } from 'lodash'
import { PersonBitModel, AppType } from '@mcro/models'
import NoResultsDialog from '../../components/NoResultsDialog'
import { AppProps } from '../AppProps'
import { fuzzyQueryFilter } from '../../helpers'
import { SearchResultsList } from '../../views/Lists/SearchResultsList'
import { observer, useComputed } from 'mobx-react-lite'
import { removePrefixIfExists } from '../../helpers/removePrefixIfExists'
import { groupByFirstLetter } from '../../helpers/groupByFirstLetter'
import { Selectable } from '../../components/Selectable'

// export default observer(function PeopleAppIndex(props: AppProps<AppType.people>) {
export default observer(function PeopleAppIndex(props: AppProps<AppType.people>) {
  // people and query
  const people = useObserveMany(PersonBitModel, { take: 10000 })
  const [activeQuery, setActiveQuery] = React.useState('')

  useComputed(
    () => {
      if (props.isActive) {
        setActiveQuery(removePrefixIfExists(props.appStore.activeQuery, '@'))
      }
    },
    [props.isActive],
  )

  // filter and group
  const results = React.useMemo(
    () => {
      const filteredPeople = fuzzyQueryFilter(activeQuery, people, {
        key: 'name',
      })
      const sortedPeople = sortBy(filteredPeople.filter(x => !!x.name), x => x.name.toLowerCase())
      return sortedPeople.length < 10 ? sortedPeople : groupByFirstLetter(sortedPeople)
    },
    [activeQuery, people.length],
  )

  if (!results.length) {
    return <NoResultsDialog subName="the directory" />
  }

  return (
    <Selectable items={results}>
      <SearchResultsList
        items={results}
        query={activeQuery}
        itemProps={props.itemProps}
        maxHeight={props.appStore.maxHeight}
        rowCount={results.length}
        onSelect={props.onSelectItem}
        onOpen={props.onOpenItem}
      />
    </Selectable>
  )
})
