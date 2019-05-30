import { Templates, useActiveAppsSorted } from '@o/kit'
import { Button, Section, SelectableGrid, SubTitle, useGet } from '@o/ui'
import pluralize from 'pluralize'
import React, { useCallback } from 'react'

import { useUserVisualAppDefinitions } from '../apps/orbitApps'
import { useAppSortHandler } from '../hooks/useAppSortHandler'
import { useOm } from '../om/om'
import { OrbitAppIcon } from './OrbitAppIcon'

export function ManageApps() {
  const om = useOm()
  const activeApps = useActiveAppsSorted()
  const viewAppDefs = useUserVisualAppDefinitions()
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
        maxWidth={220}
        items={[
          ...activeApps.map(x => ({
            id: x.id,
            title: x.name,
            subTitle: x.identifier,
            type: 'installed',
            groupName: 'Installed Apps',
            disabled: x.tabDisplay !== 'plain',
            onDoubleClick: () => {
              om.actions.router.showAppPage({ id: `${x.id}` })
            },
          })),
        ]}
        getItem={useCallback(({ onClick, onDoubleClick, ...item }, { isSelected, select }) => {
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
