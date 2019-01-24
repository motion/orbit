import { capitalize } from 'lodash'
import * as React from 'react'
import { useActiveAppsSorted } from '../../hooks/useActiveAppsSorted'
import { RoundButton } from '../../views'
import OrbitList from '../../views/Lists/OrbitList'

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
      <OrbitList sortable items={results} />
    </>
  )
}
