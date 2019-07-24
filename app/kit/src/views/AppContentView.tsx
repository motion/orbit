import { SelectableGrid, SelectableSurface } from '@o/ui'
import { uniqBy } from 'lodash'
import React, { useCallback, useMemo } from 'react'

import { useActiveAppsWithDefinition } from '../hooks/useActiveAppsWithDefinition'
import { useAppState } from '../hooks/useAppState'
import { AppIcon } from './AppIcon'
import { AppMainView } from './AppMainView'

export type AppContentViewProps = {
  /** Unique identifier if you display more than one in an app */
  id?: string
}

export function AppContentView(props: AppContentViewProps) {
  const [identifier, setIdentifier] = useAppState(`AppContentView-${props.id}`, null)
  const all = uniqBy(useActiveAppsWithDefinition(), x => x.definition.id)

  if (identifier) {
    return <AppMainView identifier={identifier} />
  }

  return (
    <SelectableGrid
      gridGap={20}
      itemMinWidth={180}
      itemMaxWidth={220}
      items={useMemo(
        () => [
          ...all.map(({ definition }) => ({
            id: definition.id,
            title: definition.name,
            type: 'installed',
            groupName: 'Installed Apps',
            onDoubleClick: () => {
              console.log('Stack navigate!')
            },
          })),
        ],
        [all],
      )}
      onSelect={useCallback(i => setIdentifier(i), [])}
      getItem={useCallback(({ onClick, onDoubleClick, ...item }, { isSelected, select }) => {
        return (
          <SelectableSurface selected={isSelected} sizeRadius flex={1}>
            <AppIcon
              identifier={item.id}
              colors={all.find(x => x.definition.id === item.id)!.app.colors}
              onClick={select}
              onDoubleClick={onDoubleClick}
            />
          </SelectableSurface>
        )
      }, [])}
    />
  )
}
