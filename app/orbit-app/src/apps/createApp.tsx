import { SaveOptions } from '@mcro/mediator'
import { save } from '@mcro/model-bridge'
import { App, AppModel, AppType } from '@mcro/models'
import { Button, Row, Theme, View } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { useActiveSpace } from '../hooks/useActiveSpace'
import { useStoresSafe } from '../hooks/useStoresSafe'
import { defaultApps } from '../stores/NewAppStore'
import { AppIcon } from '../views/AppIcon'
import { BorderTop } from '../views/Border'
import SelectableList from '../views/Lists/SelectableList'
import { Section } from '../views/Section'
import VerticalSplitPane from '../views/VerticalSplitPane'
import AppsMainNew from './apps/AppsMainNew'
import { AppProps } from './AppTypes'
import { AppView } from './AppView'
import PreviewApp from './views/PreviewApp'

const descriptions = {
  search: 'Custom search with filters',
  lists: 'Controlled or controllable list',
  people: 'Manageable list of people',
}

function CreateAppIndex() {
  return (
    <>
      <SelectableList
        items={defaultApps.map(app => ({
          title: app.name,
          subtitle: descriptions[app.type],
          icon: <AppIcon app={app} />,
          type: AppType[app.type],
          iconBefore: true,
        }))}
      />
    </>
  )
}

const CreateAppMain = observer(function CreateAppMain(props: AppProps) {
  const { newAppStore } = useStoresSafe()
  const [activeSpace] = useActiveSpace()

  if (!props.appConfig) {
    return null
  }

  const { type } = props.appConfig

  useEffect(
    () => {
      newAppStore.setApp(type)
    },
    [type],
  )

  const app = {
    type,
  } as App

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
    newAppStore.setShowCreateNew(true)
  }

  return (
    <Row flex={1}>
      <View width="50%">
        {/* <SectionTitle>Setup</SectionTitle> */}

        <Section paddingTop={0}>
          <AppsMainNew />
        </Section>

        <Section paddingTop={0}>
          <AppView type={type} appConfig={{}} viewType="settings" />
        </Section>
      </View>

      <VerticalSplitPane>
        <PreviewApp app={app} />

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
})

export const createApp = {
  index: CreateAppIndex,
  main: CreateAppMain,
}
