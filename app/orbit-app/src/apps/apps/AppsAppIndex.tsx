import { Button, View } from '@mcro/ui'
import { capitalize } from 'lodash'
import * as React from 'react'
import { useActiveAppsSorted } from '../../hooks/useActiveAppsSorted'
import { RoundButton } from '../../views'
import OrbitList from '../../views/Lists/OrbitList'
import { SortableGrid } from '../../views/SortableGrid'

export default function AppsAppIndex() {
  const activeApps = useActiveAppsSorted()
  const activeItems = activeApps.map(x => ({
    id: x.id,
    title: x.name,
    icon: `orbit${capitalize(x.type)}`,
    type: 'installed',
    group: 'Installed Apps',
    after: <RoundButton circular icon="remove" />,
  }))
  const results = [...activeItems]

  return (
    <>
      <SortableGrid
        items={[
          ...[1, 2, 3, 4, 5, 6, 7, 8].map(x => (
            <View>
              <Button icon="hi" size={2} /> test 123 {x}
            </View>
          )),
        ]}
      />
      <OrbitList sortable items={results} />
    </>
  )
}
