import { useModels } from '@mcro/model-bridge'
import { SpaceModel } from '@mcro/models'
import { Button } from '@mcro/ui'
import * as React from 'react'
import { useActiveUser } from '../../hooks/useActiveUser'
import { useOrbitFilterableResults } from '../../hooks/useOrbitFilterableResults'
import SelectableList from '../../views/Lists/SelectableList'
import { OrbitOrb } from '../../views/OrbitOrb'

export default function SpacesAppIndex() {
  const [user = {}, setUser] = useActiveUser()
  const activeSpaceId = (user && user.activeSpace) || -1
  const [allSpaces] = useModels(SpaceModel, {})
  const activeSpace = allSpaces.find(x => x.id === activeSpaceId)
  const inactiveSpaces = allSpaces.filter(x => x.id !== activeSpaceId)

  if (!activeSpace) {
    return null
  }

  const items = [
    {
      id: `${activeSpace.id}`,
      group: 'Spaces',
      title: activeSpace.name,
      subtitle: '10 members',
      before: <OrbitOrb size={20} colors={activeSpace.colors} marginRight={12} />,
      subType: 'space',
      after: <Button chromeless circular icon="check" iconSize={12} />,
    },
    ...inactiveSpaces.map(space => ({
      id: `${space.id}`,
      group: 'Spaces',
      subType: 'space',
      title: space.name,
      subtitle: '10 members',
      before: <OrbitOrb size={16} colors={space.colors} marginRight={12} />,
      onOpen: () => {
        setUser({ activeSpace: space.id })
      },
    })),
    {
      group: 'Spaces',
      title: 'Create new space...',
      icon: 'add',
      padding: [16, 11],
      subType: 'new-space',
      titleProps: {
        fontWeight: 300,
      },
    },
  ]

  const results = useOrbitFilterableResults({
    items,
  })

  return <SelectableList minSelected={0} items={results} />
}
