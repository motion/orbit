import { AppType } from '@mcro/models'
import { BorderLeft, Button, Row, Theme, View } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { useStoresSafe } from '../hooks/useStoresSafe'
import { defaultApps } from '../stores/NewAppStore'
import { Title } from '../views'
import { BorderTop } from '../views/Border'
import { Divider } from '../views/Divider'
import SelectableList from '../views/Lists/SelectableList'
import { Section } from '../views/Section'
import { AppProps } from './AppProps'
import AppsMainNew, { AppIcon } from './apps/AppsMainNew'
import { AppView } from './AppView'

const descriptions = {
  search: 'Custom search with filters',
  lists: 'Controlled or controllable list',
  people: 'Manageable list of people',
}

function CreateAppIndex() {
  return (
    <>
      <Section paddingBottom={0}>
        <Title>Choose type</Title>
      </Section>
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

const CreateAppMain = observer(function CreateAppMain(props: AppProps<AppType.createApp>) {
  const { newAppStore } = useStoresSafe()

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

  return (
    <Row flex={1}>
      <View width="50%">
        <Section paddingBottom={0}>
          <Title>Setup</Title>
        </Section>

        <Section paddingTop={0}>
          <AppsMainNew />
        </Section>

        <Divider />

        <Section paddingTop={0}>
          <AppView type={type} viewType="settings" />
        </Section>
      </View>

      <View width="50%" position="relative">
        <BorderLeft />

        <Section paddingBottom={0}>
          <Title>Preview</Title>
        </Section>

        <View flex={1}>
          <AppView
            viewType="index"
            id={type}
            type={type}
            appConfig={{
              type: type,
            }}
          />
        </View>

        <Section>
          <BorderTop />

          <Theme name="selected">
            <Button elevation={2} size={1.4}>
              Create
            </Button>
          </Theme>
        </Section>
      </View>
    </Row>
  )
})

export const createApp = {
  index: CreateAppIndex,
  main: CreateAppMain,
}
