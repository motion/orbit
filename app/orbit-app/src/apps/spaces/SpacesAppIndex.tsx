import { useModels } from '@o/bridge'
import { OrbitOrb, useActiveUser } from '@o/kit'
import { SpaceModel } from '@o/models'
import { Button, List } from '@o/ui'
import * as React from 'react'

export default function SpacesAppIndex() {
  const [user, updateUser] = useActiveUser()
  const activeSpaceId = (user && user.activeSpace) || -1
  const [allSpaces] = useModels(SpaceModel, {})

  return (
    <List
      items={[
        ...allSpaces.map(space => ({
          id: `${space.id}`,
          subType: 'space',
          title: space.name,
          before: <OrbitOrb size={16} colors={space.colors} marginRight={12} />,
          height: 50,
          after: activeSpaceId === space.id && (
            <Button chromeless circular icon="tick" iconSize={12} />
          ),
          onOpen: () => {
            updateUser(user => {
              user.activeSpace = space.id
            })
          },
        })),
        {
          // group: 'Manage',
          id: 'new-space',
          title: 'New',
          subTitle: 'Create new space...',
          icon: 'add',
          iconBefore: true,
          iconProps: {
            size: 16,
          },
          subType: 'new-space',
        },
      ]}
    />
  )
}
