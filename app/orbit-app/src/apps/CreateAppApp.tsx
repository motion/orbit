import { save } from '@o/bridge'
import { App, AppIcon, AppProps, AppView, createApp, List, useActiveSpace } from '@o/kit'
import { AppBit, AppModel } from '@o/models'
import { Button, Divider, FormField, Section, Space, TitleRow } from '@o/ui'
import React, { useEffect } from 'react'
import { useActions } from '../hooks/useActions'
import { useStores } from '../hooks/useStores'
import { defaultApps } from '../stores/NewAppStore'
import { AppsMainNew } from './apps/AppsMainNew'
import PreviewApp from './views/PreviewApp'

const descriptions = {
  search: 'Custom search with filters',
  lists: 'Controlled or controllable list',
  people: 'Manageable list of people',
  custom: 'Internal development test app',
  custom2: 'Internal development test app',
}

function CreateAppIndex() {
  const Actions = useActions()
  return (
    <>
      <TitleRow
        title="Add app"
        subTitle="Add app to this workspace"
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
        items={defaultApps.map(app => ({
          title: app.name,
          identifier: app.identifier,
          subtitle: descriptions[app.identifier],
          icon: <AppIcon app={app} />,
          iconBefore: true,
          group: 'Apps',
        }))}
      />
    </>
  )
}

function CreateAppMain({ title, identifier }: AppProps) {
  const Actions = useActions()
  const { newAppStore } = useStores()
  const [activeSpace] = useActiveSpace()

  useEffect(
    () => {
      if (identifier) {
        newAppStore.setApp(identifier)
      }
    },
    [identifier],
  )

  if (!identifier) {
    return null
  }

  const app = { identifier } as AppBit
  const createApp = async () => {
    const app = {
      ...newAppStore.app,
      spaceId: activeSpace.id,
    }
    save(AppModel, app)
    Actions.previousTab()
  }

  return (
    <Section>
      <TitleRow
        bordered
        backgrounded
        title="Setup app"
        subTitle={`Create ${title} app`}
        after={
          <>
            <Space />
            <Button iconAfter alt="action" icon="arrowright" onClick={createApp}>
              Create
            </Button>
          </>
        }
      />

      <Section padded>
        <FormField label="Name and Icon">
          <AppsMainNew />
        </FormField>

        <Divider />

        <FormField label="Settings">
          <AppView identifier={identifier} viewType="settings" />
        </FormField>
      </Section>

      <Section bordered title="Preview" minHeight={200}>
        <PreviewApp app={app} />
      </Section>
    </Section>
  )
}

export const CreateApp = createApp({
  id: 'createApp',
  name: 'Create App',
  icon: '',
  app: props => (
    <App index={<CreateAppIndex />}>
      <CreateAppMain {...props} />
    </App>
  ),
})
