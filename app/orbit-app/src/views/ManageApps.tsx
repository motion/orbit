import { Templates, useActiveAppsSorted } from '@o/kit'
import { Section, SelectableGrid, useGet, Button, SubTitle } from '@o/ui'
import React, { useCallback } from 'react'
import pluralize from 'pluralize'

import { useAppSortHandler } from '../hooks/useAppSortHandler'
import { useOm } from '../om/om'
import { AppIconContainer, LargeIcon, OrbitAppIcon } from './OrbitAppIcon'
import { useUserVisualApps } from '../apps/orbitApps'

export function ManageApps() {
  const om = useOm()
  const activeApps = useActiveAppsSorted()
  const viewAppDefs = useUserVisualApps()
  const getActiveApps = useGet(activeApps)
  const handleSortEnd = useAppSortHandler()

  if (!activeApps.length) {
    return (
      <Templates.Message
        icon="app"
        title="No apps installed yet!"
        subTitle="Use the sidebar to setup data source apps."
      >
        <SubTitle>
          You have {viewAppDefs.length} view {pluralize('app', viewAppDefs.length)}, you can set it
          up in the toolbar, or:
        </SubTitle>
        <Button alt="action" onClick={() => om.actions.router.showAppPage({ id: 'setupApp' })}>
          Setup app
        </Button>
      </Templates.Message>
    )
  }

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
            groupName: 'Installed Apps',
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
