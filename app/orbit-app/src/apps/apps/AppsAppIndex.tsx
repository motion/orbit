import { Absolute, Theme } from '@mcro/ui'
import { capitalize } from 'lodash'
import * as React from 'react'
import { useActiveAppsSorted } from '../../hooks/useActiveAppsSorted'
import { RoundButton } from '../../views'
import SelectableList from '../../views/Lists/SelectableList'

export default function AppsAppIndex() {
  const activeApps = useActiveAppsSorted()
  const activeItems = activeApps.map(x => ({
    id: x.id,
    title: x.name,
    icon: `orbit${capitalize(x.type)}`,
    type: 'installed',
    group: 'Installed Apps',
  }))
  const results = [
    {
      id: -1,
      title: 'Installed apps',
      type: 'installed',
      icon: 'grid48',
      subtitle: `${activeItems.map(x => x.title).join(', ')}`,
      appConfig: {
        id: -1,
        type: 'installed',
      },
    },
    ...activeItems.map(x => ({
      ...x,
      type: 'add',
      group: 'Add app',
    })),
  ]

  return (
    <>
      <SelectableList sortable defaultSelected={0} items={results} />
      <Absolute bottom={10} right={10}>
        <Theme name="selected">
          <RoundButton
            elevation={1}
            size={1.8}
            sizeIcon={0.6}
            circular
            icon="add"
            tooltip="Create new app"
          />
        </Theme>
      </Absolute>
    </>
  )
}
