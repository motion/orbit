import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { OrbitList } from '../../views/Lists/OrbitList'
import { Selectable } from '../../components/Selectable'
import { useOrbitFilterableResults } from '../../hooks/useOrbitFilterableResults'

export default observer(function SourcesAppIndex() {
  const results = useOrbitFilterableResults({
    items: [
      { id: 0, title: 'General', icon: 'gear', subtitle: 'General Settings' },
      { id: 1, title: 'Account', icon: 'user', subtitle: 'Sync status' },
    ],
  })

  return (
    <Selectable items={results}>
      <OrbitList items={results} />
    </Selectable>
  )
})
