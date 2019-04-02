import { App, AppIcon, createApp, List, View } from '@o/kit'
import { Button, Section, SurfacePassProps, Text, Toolbar } from '@o/ui'
import React, { useState } from 'react'
import { useActions } from '../hooks/useActions'
import { defaultApps } from '../stores/NewAppStore'

const descriptions = {
  search: 'Custom search with filters',
  lists: 'Controlled or controllable list',
  people: 'Manageable list of people',
  custom: 'Internal development test app',
  custom2: 'Internal development test app',
}

function CreateAppMain() {
  const Actions = useActions()
  const [selected, setSelected] = useState(null)
  console.log('selected', selected)
  return (
    <>
      <Section
        width="70%"
        background="transparent"
        margin="auto"
        height="70%"
        padded
        title="New app"
        subTitle="Choose app to add"
      >
        <List
          selectable
          alwaysSelected
          onSelect={rows => setSelected(rows[0])}
          items={defaultApps.map(app => ({
            title: app.name,
            identifier: app.identifier,
            subtitle: descriptions[app.identifier],
            icon: <AppIcon app={app} />,
            iconBefore: true,
            iconProps: {
              size: 44,
            },
          }))}
        />
      </Section>
      <Toolbar elevation={2}>
        <SurfacePassProps>
          <Button
            iconAfter
            alt="action"
            onClick={() => {
              Actions.createCustomApp()
            }}
            icon="simadd"
            tooltip="Create new custom app"
          >
            Create Custom App
          </Button>
          <View flex={1} />

          {selected && (
            <View minWidth={200} padding={[0, 30]}>
              <Text fontWeight={600}>Add app to space</Text>
              <Text ellipse alpha={0.6} size={1.25}>
                {selected.title}
              </Text>
            </View>
          )}

          <Button
            size={1.25}
            alt="confirm"
            iconAfter
            onClick={() => {
              Actions.createCustomApp()
            }}
            icon="arrowminright"
            tooltip="Create new custom app"
          >
            Add
          </Button>
        </SurfacePassProps>
      </Toolbar>
    </>
  )
}

export const CreateApp = createApp({
  id: 'createApp',
  name: 'Create App',
  icon: '',
  app: () => (
    <App>
      <CreateAppMain />
    </App>
  ),
})
