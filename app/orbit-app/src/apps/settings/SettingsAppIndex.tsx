import * as React from 'react'
import { useOrbitFilterableResults } from '../../hooks/useOrbitFilterableResults'
import SelectableList from '../../views/Lists/SelectableList'

export default function SourcesAppIndex() {
  const results = useOrbitFilterableResults({
    items: [
      { id: 0, title: 'General', icon: 'gear', subtitle: 'General Settings' },
      { id: 1, title: 'Account', icon: 'user', subtitle: 'Sync status' },
    ],
  })

  return <SelectableList items={results} />
}
