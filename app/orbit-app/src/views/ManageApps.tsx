import { getAppDefinition, isDataDefinition, Templates, useActiveAppsSorted } from '@o/kit'
import { Button, Center, Section, SortableGrid, SortableGridProps, SubTitle, View } from '@o/ui'
import { partition } from 'lodash'
import pluralize from 'pluralize'
import React from 'react'

import { useUserVisualAppDefinitions } from '../apps/orbitApps'
import { useAppSortHandler } from '../hooks/useAppSortHandler'
import { useOm } from '../om/om'
import { OrbitAppIcon } from './OrbitAppIcon'

export function ManageApps() {
  const om = useOm()
  const activeApps = useActiveAppsSorted().map(app => ({
    app,
    definition: getAppDefinition(app.identifier),
  }))
  const viewAppDefs = useUserVisualAppDefinitions()
  const handleSortEnd = useAppSortHandler()
  const [dataApps, viewApps] = partition(activeApps, x => isDataDefinition(x.definition))

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
    <Section title="Installed Apps" size="lg" pad>
      <Section size="xs" title="View apps">
        {!viewApps.length && (
          <View height={200} position="relative">
            <Center>
              <SubTitle>No view apps</SubTitle>
            </Center>
          </View>
        )}
        <AppSortableGrid
          margin={[16, 0]}
          sortable
          items={viewApps}
          getItem={item => {
            return (
              <OrbitAppIcon
                app={item.app}
                onDoubleClick={() => {
                  om.actions.router.showAppPage({ id: `${x.id}` })
                }}
              />
            )
          }}
          distance={10}
          onSortEnd={handleSortEnd}
          getSortableItemProps={item => {
            if (item.app.tabDisplay === 'permanent') {
              return {
                disabled: true,
              }
            }
          }}
        />
      </Section>

      <Section size="xs" title="Data apps">
        {!dataApps.length && (
          <View height={200} position="relative">
            <Center>
              <SubTitle>No data apps</SubTitle>
            </Center>
          </View>
        )}
        <AppSortableGrid
          margin={[16, 0]}
          items={dataApps}
          getItem={item => {
            return <OrbitAppIcon app={item.app} />
          }}
        />
      </Section>
    </Section>
  )
}

function AppSortableGrid<A>(props: SortableGridProps<A>) {
  return (
    <SortableGrid
      itemMinWidth={180}
      itemMaxWidth={220}
      itemMinHeight={220}
      distance={10}
      {...props}
    />
  )
}
