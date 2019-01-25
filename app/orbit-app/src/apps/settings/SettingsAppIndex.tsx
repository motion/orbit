import * as React from 'react'
import { useOrbitFilterableResults } from '../../hooks/useOrbitFilterableResults'
import SelectableList from '../../views/Lists/SelectableList'

export default function SourcesAppIndex() {
  const results = useOrbitFilterableResults({
    items: [
      { id: 0, type: 'general', title: 'General', icon: 'gear', subtitle: 'General Settings' },
      { id: 1, type: 'spaces', title: 'Spaces', icon: 'space', subtitle: 'Manage spaces' },
      { id: 2, type: 'account', title: 'My account', icon: 'user', subtitle: 'Sync status' },
    ],
  })

  return <SelectableList minSelected={0} items={results} />
}
