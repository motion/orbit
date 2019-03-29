import { App, AppIcon, createApp, List } from '@o/kit'
import { Button, Section, TitleRow } from '@o/ui'
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
    <Section padded>
      <TitleRow
        title="1. Select app"
        subTitle="Choose app to add"
        after={
          <>
            <Button
              alt="confirm"
              onClick={() => {
                Actions.createCustomApp()
              }}
              icon="simadd"
              iconAfter
              tooltip="Create new custom app"
            >
              New
            </Button>
          </>
        }
      />
      <List
        minSelected={-1}
        items={defaultApps.map(app => ({
          title: app.name,
          identifier: app.identifier,
          subtitle: descriptions[app.identifier],
          icon: <AppIcon app={app} />,
          iconBefore: true,
          group: 'Apps',
        }))}
      />
    </Section>
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
