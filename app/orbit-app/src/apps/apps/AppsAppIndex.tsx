import { AppType } from '@mcro/models'
import { capitalize } from 'lodash'
import * as React from 'react'
import { useActiveAppsSorted } from '../../hooks/useActiveAppsSorted'
import SelectableList from '../../views/Lists/SelectableList'
import { AppProps } from '../AppProps'

export default function AppsAppIndex(props: AppProps<AppType.apps>) {
  const activeApps = useActiveAppsSorted()
  const results = activeApps.map(x => ({
    id: x.id,
    title: x.name,
    icon: `orbit${capitalize(x.type)}`,
    group: 'Installed Apps',
  }))

  return (
    <SelectableList
      sortable
      defaultSelected={0}
      items={results}
      onSelect={props.onSelectItem}
      onOpen={props.onOpenItem}
    />
  )
}
