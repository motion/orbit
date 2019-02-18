import { SaveOptions } from '@mcro/mediator'
import { AppBit, AppModel } from '@mcro/models'
import { Button, Row, Theme, View } from '@mcro/ui'
import React, { useEffect, useState } from 'react'
import { useActiveSpace } from '../hooks/useActiveSpace'
import { useStores } from '../hooks/useStores'
import { save } from '../mediator'
import { defaultApps } from '../stores/NewAppStore'
import { AppIcon } from '../views/AppIcon'
import { BorderTop } from '../views/Border'
import SelectableList from '../views/Lists/SelectableList'
import { Section } from '../views/Section'
import VerticalSplitPane from '../views/VerticalSplitPane'
import AppsMainNew from './apps/AppsMainNew'
import { AppProps, AppType } from './AppTypes'
import { AppView } from './AppView'
import PreviewApp from './views/PreviewApp'

const descriptions = {
  search: 'Custom search with filters',
  lists: 'Controlled or controllable list',
  people: 'Manageable list of people',
}

function CreateAppIndex() {
  return (
    <SelectableList
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
    // TODO @umed it complains on saving an app here
    // because colors: string[] not assignable to colors: string
    // not sure why, but can you check into i?
    // @ts-ignore
    save(AppModel, app as SaveOptions<App>)
    newAppStore.setShowCreateNew(false)
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
