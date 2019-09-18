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
    definition: getAppDefinition(app.identifier!),
  }))
  console.log('activeApps', activeApps)
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
        <Button coat="action" onClick={() => om.actions.router.showAppPage({ id: 'setupApp' })}>
          Setup app
        </Button>
      </Templates.Message>
    )
  }

  return (
    <Section title="Apps" size="md" padding space="lg" scrollable="y" titleBorder>
      <SubSection padding={[true, 0]} title="View apps">
        {!viewApps.length && (
          <View height={200} position="relative">
            <Center>
              <SubTitle>No view apps</SubTitle>
            </Center>
          </View>
        )}
        <AppSortableGrid
          sortable
          items={viewApps}
          itemMinWidth={220}
          getItem={item => {
            return (
              <OrbitAppIcon
                removable
                app={item.app}
                onDoubleClick={() => {
                  console.log('double click', item)
                  om.actions.router.showAppPage({ id: `${item.app.id}` })
                }}
              />
            )
          }}
          distance={10}
          onSortEnd={handleSortEnd}
          getSortableItemProps={item => {
            if (item.app.tabDisplay === 'permanent' || item.app.tabDisplay === 'permanentLast') {
              return {
                disabled: true,
              }
            }
          }}
        />
      </SubSection>

      <SubSection padding={[true, 0]} title="Data apps">
        {!dataApps.length && (
          <View height={200} position="relative">
            <Center>
              <SubTitle>No data apps</SubTitle>
            </Center>
          </View>
        )}
        <AppSortableGrid
          margin={[16, 0]}
          itemMinWidth={220}
          items={dataApps}
          getItem={item => {
            return <OrbitAppIcon removable app={item.app} />
          }}
        />
      </SubSection>
    </Section>
  )
}

const SubSection = props => (
  <Section size="xs" titleSize="xxxs" titleProps={{ fontWeight: 300, alpha: 0.75 }} {...props} />
)

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
