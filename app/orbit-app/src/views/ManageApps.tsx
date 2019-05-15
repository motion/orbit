import { useActiveAppsSorted } from '@o/kit'
import { Section, SelectableGrid, useGet } from '@o/ui'
import React, { useCallback } from 'react'

import { useAppSortHandler } from '../hooks/useAppSortHandler'
import { useOm } from '../om/om'
import { AppIconContainer, LargeIcon, OrbitAppIcon } from './OrbitAppIcon'

export function ManageApps() {
  const om = useOm()
  const activeApps = useActiveAppsSorted()
  const getActiveApps = useGet(activeApps)
  const handleSortEnd = useAppSortHandler()

  return (
    <Section padInner="lg" background="transparent">
      <SelectableGrid
        sortable
        minWidth={180}
        items={[
          ...activeApps.map(x => ({
            id: x.id,
            title: x.name,
            type: 'installed',
            group: 'Installed Apps',
            disabled: x.tabDisplay !== 'plain',
            onDoubleClick: () => {
              om.actions.router.showAppPage({ id: `${x.id}` })
            },
          })),
        ]}
        getItem={useCallback(({ onClick, onDoubleClick, ...item }, { isSelected, select }) => {
          if (item.type === 'add') {
            // TODO on click to new app pane
            return (
              <AppIconContainer onClick={onClick} onDoubleClick={onDoubleClick}>
                <LargeIcon {...item} />
              </AppIconContainer>
            )
          }
          return (
            <OrbitAppIcon
              app={getActiveApps().find(x => x.id === item.id)}
              isSelected={isSelected}
              onClick={select}
              onDoubleClick={onDoubleClick}
            />
          )
        }, [])}
        distance={10}
        onSortEnd={handleSortEnd}
        getSortableItemProps={item => {
          if (item.disabled) {
            return {
              disabled: true,
            }
          }
        }}
      />
    </Section>
  )
}
