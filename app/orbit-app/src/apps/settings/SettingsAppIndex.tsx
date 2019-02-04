import { useObserveMany } from '@mcro/model-bridge'
import { SpaceModel } from '@mcro/models'
import { Button } from '@mcro/ui'
import * as React from 'react'
import { useActiveUser } from '../../hooks/useActiveUser'
import { useOrbitFilterableResults } from '../../hooks/useOrbitFilterableResults'
import SelectableList from '../../views/Lists/SelectableList'
import { OrbitOrb } from '../../views/OrbitOrb'

export default function SourcesAppIndex() {
  const [user = {}, setUser] = useActiveUser()
  const spaces = useObserveMany(SpaceModel, {})

  const results = useOrbitFilterableResults({
    items: [
      {
        group: 'Settings',
        subType: 'general',
        title: 'General',
        icon: 'gear',
        iconBefore: true,
        subtitle: 'Shortcuts, startup, theme',
      },
      {
        group: 'Settings',
        subType: 'account',
        title: 'Account',
        icon: 'users_badge',
        iconBefore: true,
        subtitle: 'Manage your account',
      },
      ...spaces.map(space => ({
        id: `${space.id}`,
        group: 'Spaces',
        subType: 'space',
        title: space.name,
        subtitle: '10 members',
        before: <OrbitOrb size={18} colors={space.colors} marginRight={12} />,
        after: space.id === user.activeSpace && (
          <Button chromeless circular icon="check" iconSize={12} />
        ),
        onOpen: () => {
          setUser({ activeSpace: space.id })
        },
      })),
    ],
  })

  if (!user) {
    return null
  }

  return <SelectableList minSelected={0} items={results} />
}
