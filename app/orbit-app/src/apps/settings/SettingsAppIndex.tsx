import { useObserveMany } from '@mcro/model-bridge'
import { SpaceModel } from '@mcro/models'
import * as React from 'react'
import { useOrbitFilterableResults } from '../../hooks/useOrbitFilterableResults'
import SelectableList from '../../views/Lists/SelectableList'

export default function SourcesAppIndex() {
  const spaces = useObserveMany(SpaceModel, {})

  const results = useOrbitFilterableResults({
    items: [
      {
        id: 0,
        group: 'Settings',
        type: 'general',
        title: 'General',
        icon: 'gear',
        subtitle: 'Shortcuts, startup, theme',
      },
      {
        id: 2,
        group: 'Settings',
        type: 'account',
        title: 'Account',
        icon: 'users_badge',
        subtitle: 'Manage your account',
      },
      ...spaces.map(space => ({
        id: `space-${space.id}`,
        group: 'Spaces',
        type: 'space',
        title: space.name,
        subtitle: '10 members',
      })),
    ],
  })

  return <SelectableList minSelected={0} items={results} />
}
