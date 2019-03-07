import { save } from '@o/bridge'
import { App, AppDefinition, AppIcon, AppProps, AppView, List, useActiveSpace } from '@o/kit'
import { AppBit, AppModel } from '@o/models'
import { Button, HorizontalSpace, Section, Theme, TitleRow } from '@o/ui'
import React, { useEffect, useState } from 'react'
import { useActions } from '../hooks/useActions'
import { useStores } from '../hooks/useStores'
import { defaultApps } from '../stores/NewAppStore'
import { SubSection } from '../views/SubSection'
import { AppsMainNew } from './apps/AppsMainNew'
import PreviewApp from './views/PreviewApp'

const descriptions = {
  search: 'Custom search with filters',
  lists: 'Controlled or controllable list',
  people: 'Manageable list of people',
}

function CreateAppIndex() {
  return (
    <List
      minSelected={0}
      items={defaultApps.map(app => ({
        title: app.name,
        identifier: app.identifier,
        subtitle: descriptions[app.identifier],
        icon: <AppIcon app={app} />,
        iconBefore: true,
      }))}
    />
  )
}

function CreateAppMain(props: AppProps) {
  const Actions = useActions()
  const { newAppStore } = useStores()
  const [activeSpace] = useActiveSpace()
  const [showPreviewApp, setShowPreviewApp] = useState(false)

  useEffect(() => {
    setShowPreviewApp(true)
  }, [])

  const { identifier } = props.appConfig || { identifier: null }

  useEffect(
    () => {
      if (identifier) {
        newAppStore.setApp(identifier)
      }
    },
    [identifier],
  )

  if (!props.appConfig || !identifier) {
    return null
  }

  const app = { identifier } as AppBit
  const createApp = async () => {
    const app = {
      ...newAppStore.app,
      spaceId: activeSpace.id,
    }
    console.log('creating new app', app)
    save(AppModel, app)
    Actions.previousTab()
  }

  return (
    <Section>
      <TitleRow
        bordered
        after={
          <>
            <Button theme="bordered" icon="lock">
              Preview
            </Button>
            <HorizontalSpace />
            <Theme name="selected">
              <Button icon="add" onClick={createApp}>
                Add
              </Button>
            </Theme>
          </>
        }
      >
        <AppsMainNew />
      </TitleRow>

      <SubSection title="App Settings">
        <AppView identifier={identifier} viewType="settings" />
      </SubSection>

      <SubSection title="Preview">{showPreviewApp && <PreviewApp app={app} />}</SubSection>
    </Section>
  )
}

export const CreateApp: AppDefinition = {
  id: 'createApp',
  name: 'Create App',
  icon: '',
  app: props => (
    <App index={<CreateAppIndex />}>
      <CreateAppMain {...props} />
    </App>
  ),
}
