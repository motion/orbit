import { useModels } from '@o/bridge'
import { List, OrbitOrb, useActiveQueryFilter, useActiveUser } from '@o/kit'
import { SpaceModel } from '@o/models'
import { Button } from '@o/ui'
import * as React from 'react'

export default function SpacesAppIndex() {
  const [user = {}, setUser] = useActiveUser()
  const activeSpaceId = (user && user.activeSpace) || -1
  const [allSpaces] = useModels(SpaceModel, {})

  const items = [
    ...allSpaces.map(space => ({
      id: `${space.id}`,
      subType: 'space',
      title: space.name,
      before: <OrbitOrb size={16} colors={space.colors} marginRight={12} />,
      height: 50,
      after: activeSpaceId === space.id && (
        <Button chromeless circular icon="check" iconSize={12} />
      ),
      onOpen: () => {
        setUser({ activeSpace: space.id })
      },
    })),
    {
      // group: 'Manage',
      title: 'New',
      subtitle: 'Create new space...',
      icon: 'add',
      iconBefore: true,
      iconProps: {
        size: 16,
      },
      subType: 'new-space',
    },
  ]

  const results = useActiveQueryFilter({
    items,
  })

  return <List minSelected={0} items={results} />
}
