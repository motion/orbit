import { App, AppIcon, createApp, List, View } from '@o/kit'
import { Button, Section, SurfacePassProps, Toolbar } from '@o/ui'
import React from 'react'
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
  return (
    <>
      <Section
        width="70%"
        background="transparent"
        margin="auto"
        height="70%"
        padded
        title="Add app"
        subTitle="Choose app to add"
      >
        <List
          alwaysSelected
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
          <Button
            size={1.25}
            alt="confirm"
            onClick={() => {
              Actions.createCustomApp()
            }}
            icon="simadd"
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
