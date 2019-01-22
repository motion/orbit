import { AppType } from '@mcro/models'
import { Absolute, Theme } from '@mcro/ui'
import { capitalize } from 'lodash'
import * as React from 'react'
import { useActiveAppsSorted } from '../../hooks/useActiveAppsSorted'
import { RoundButton } from '../../views'
import SelectableList from '../../views/Lists/SelectableList'
import { AppProps } from '../AppProps'

export default function AppsAppIndex(props: AppProps<AppType.apps>) {
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
      icon: 'grid48',
      subtitle: `${activeItems.map(x => x.title).join(', ')}`,
      appConfig: {
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
      <SelectableList
        sortable
        defaultSelected={0}
        items={results}
        onSelect={props.onSelectItem}
        onOpen={props.onOpenItem}
      />
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
