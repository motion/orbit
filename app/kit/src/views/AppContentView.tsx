import { AppViewProps } from '@o/models'
import { SelectableGrid, SelectableSurface, SubSection } from '@o/ui'
import { uniqBy } from 'lodash'
import React, { useCallback, useMemo } from 'react'

import { useActiveAppsWithDefinition } from '../hooks/useActiveAppsWithDefinition'
import { useAppState } from '../hooks/useAppState'
import { AppIcon } from './AppIcon'
import { AppMainView } from './AppMainView'

export type AppContentViewProps = AppViewProps & {
  /** Unique identifier if you display more than one in an app */
  id?: string
}

export function AppContentView(props: AppContentViewProps) {
  const [identifier, setIdentifier] = useAppState(`AppContentV-${props.id}`, null)
  const all = uniqBy(useActiveAppsWithDefinition(), x => x.definition.id).filter(
    x => !!x.definition.itemType,
  )

  if (identifier) {
    return <AppMainView identifier={identifier} />
  }

  return (
    <SubSection title="Select Content Type" flex={1} scrollable="y">
      <SelectableGrid
        padding={20}
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
            })),
          ],
          [all],
        )}
        // @ts-ignore
        getItem={useCallback((item, { isSelected, select }) => {
          const { definition, app } = all.find(x => x.definition.id === item.id)!
          return (
            <SelectableSurface
              selected={isSelected}
              sizeRadius
              flex={1}
              alignItems="center"
              justifyContent="center"
              minHeight={180}
            >
              <AppIcon
                identifier={item.id}
                colors={app.colors}
                onClick={select}
                onDoubleClick={() => setIdentifier(definition.id)}
                size={80}
              />
            </SelectableSurface>
          )
        }, [])}
      />
    </SubSection>
  )
}
