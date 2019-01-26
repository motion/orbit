import { useObserveMany } from '@mcro/model-bridge'
import { SpaceModel } from '@mcro/models'
import { Icon } from '@mcro/ui'
import * as React from 'react'
import { useOrbitFilterableResults } from '../../hooks/useOrbitFilterableResults'
import SelectableList from '../../views/Lists/SelectableList'
import { OrbitOrb } from '../../views/OrbitOrb'

export default function SourcesAppIndex() {
  const spaces = useObserveMany(SpaceModel, {})

  const results = useOrbitFilterableResults({
    items: [
      {
        group: 'Settings',
        type: 'general',
        title: 'General',
        icon: 'gear',
        subtitle: 'Shortcuts, startup, theme',
      },
      {
        group: 'Settings',
        type: 'account',
        title: 'Account',
        icon: 'users_badge',
        subtitle: 'Manage your account',
      },
      ...spaces.map((space, index) => ({
        id: space.id,
        group: 'Spaces',
        type: 'space',
        title: space.name,
        subtitle: '10 members',
        before: <OrbitOrb size={18} marginRight={10} />,
        after: index === 0 && <Icon name="check" size={12} />,
      })),
      {
        group: 'Spaces',
        title: 'Create new space...',
        icon: 'add',
        padding: [16, 11],
        type: 'new-space',
        titleProps: {
          fontWeight: 300,
        },
      },
    ],
  })

  return <SelectableList minSelected={0} items={results} />
}
