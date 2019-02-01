import { AppType } from '@mcro/models'
import { Absolute, BorderLeft, Button, Row, Theme, View } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { useStoresSafe } from '../hooks/useStoresSafe'
import OrbitControls from '../pages/OrbitPage/OrbitControls'
import { defaultApps } from '../stores/NewAppStore'
import { Title } from '../views'
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
        minSelected={0}
        items={defaultApps.map(app => ({
          title: app.name,
          subtitle: descriptions[app.type],
          icon: <AppIcon app={app} />,
          type: app.type,
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
          <Title>Customize</Title>
        </Section>

        <Section paddingTop={0}>
          <AppsMainNew />
        </Section>
        <OrbitControls />
      </View>

      <View width="50%" position="relative">
        <BorderLeft />
        <AppView
          viewType="index"
          id={type}
          type={type}
          appConfig={{
            type: type,
          }}
        />
      </View>

      <Absolute bottom={25} right={25}>
        <Theme name="selected">
          <Button elevation={2} size={1.4}>
            Add
          </Button>
        </Theme>
      </Absolute>
    </Row>
  )
})

export const createApp = {
  index: CreateAppIndex,
  main: CreateAppMain,
}
