import { save } from '@mcro/bridge'
import { AppIcon, AppType, AppView, List, useActiveSpace } from '@mcro/kit'
import { AppBit, AppModel } from '@mcro/models'
import { BorderTop, Button, Row, Section, Theme, VerticalSplitPane, View } from '@mcro/ui'
import React, { useEffect, useState } from 'react'
import { useActions } from '../actions/Actions'
import { useStores } from '../hooks/useStores'
import { defaultApps } from '../stores/NewAppStore'
import AppsMainNew from './apps/AppsMainNew'
import { AppProps } from './AppTypes'
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
        subType: app.type,
        subtitle: descriptions[app.type],
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

  if (!props.appConfig) {
    return null
  }

  const { subType } = props.appConfig

  useEffect(
    () => {
      if (subType) {
        newAppStore.setApp(AppType[subType])
      }
    },
    [subType],
  )

  const app = { type: subType } as AppBit

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
    <Row flex={1}>
      <View width="50%">
        <Section paddingTop={0}>
          <AppsMainNew />
        </Section>

        <Section paddingTop={0}>
          <AppView type={subType} appConfig={{}} viewType="settings" />
        </Section>
      </View>

      <VerticalSplitPane>
        {showPreviewApp && <PreviewApp app={app} />}

        <View flex={1} />

        <Section>
          <BorderTop />
          <Theme name="selected">
            <Button elevation={2} size={1.4} onClick={createApp}>
              Create
            </Button>
          </Theme>
        </Section>
      </VerticalSplitPane>
    </Row>
  )
}

export const createApp = {
  index: CreateAppIndex,
  main: CreateAppMain,
}
