import { AppIcon, createApp } from '@o/kit'
import { Button, Col, Flow, List, ListItemProps, Section, Text, Toolbar, View } from '@o/ui'
import React, { useState } from 'react'

import { useOm } from '../om/om'
import { useUserVisualAppDefinitions } from './orbitApps'
import { StackNavigator, useStackNavigator } from './StackNavigator'

export default createApp({
  id: 'setupApp',
  name: 'Setup App',
  icon: 'plus',
  app: SetupAppMain,
})

function SetupAppMain() {
  return (
    <StackNavigator
      defaultItem={{
        id: 'SetupAppHome',
        props: {},
      }}
      items={{
        SetupAppHome,
        SetupAppCustom,
      }}
    />
  )
}

function SetupAppCustom() {
  const stackNav = useStackNavigator()
  const { actions } = useOm()
  return (
    <>
      <Col width="70%" background="transparent" margin="auto">
        <Flow>
          <Flow.Step title="Template" subTitle="Choose template">
            <Col pad>hello 123</Col>
          </Flow.Step>
        </Flow>
      </Col>

      <Toolbar size="md">
        <Button alt="action" iconAfter={false} icon="chevron-left" onClick={stackNav.back}>
          Back
        </Button>
        <View flex={1} />
        <Button
          size={1.4}
          alt="confirm"
          onClick={() => {
            actions.setupApp.create(selected.identifier)
          }}
          icon="chevron-right"
        >
          Start
        </Button>
      </Toolbar>
    </>
  )
}

function SetupAppHome() {
  const { actions } = useOm()
  const stackNav = useStackNavigator()
  const items: ListItemProps[] = useUserVisualAppDefinitions().map(app => ({
    title: app.name,
    identifier: app.id,
    subTitle: app.description || 'No description',
    icon: <AppIcon app={{ identifier: app.id, colors: ['red', 'pink'] }} />,
    iconBefore: true,
    iconProps: {
      size: 44,
    },
  }))
  const [selected, setSelected] = useState<ListItemProps>(null)

  return (
    <>
      <Section
        width="70%"
        background="transparent"
        margin="auto"
        height="80%"
        titleSize={0.85}
        title="Add app to workspace"
        bordered
        subTitle="Choose from your installed apps."
      >
        <List
          searchable
          selectable
          alwaysSelected
          onSelect={rows => setSelected(rows[0])}
          items={items}
        />
      </Section>

      <Toolbar size="md">
        <Button
          alt="action"
          onClick={() => {
            stackNav.navigate({
              id: 'SetupAppCustom',
            })
          }}
          icon="plus"
          tooltip="Create new custom app"
        >
          Create Custom App
        </Button>
        <View flex={1} />
        {selected && (
          <View minWidth={200} padding={[0, 30]} margin={[-10, 0]}>
            <Text fontWeight={600}>Add app to space</Text>
            <Text ellipse alpha={0.6} size={1.25}>
              {selected.title}
            </Text>
          </View>
        )}
        <Button
          size={1.4}
          alt="confirm"
          onClick={() => {
            actions.setupApp.create(selected.identifier)
          }}
          icon="chevron-right"
          tooltip="Create new custom app"
        >
          Add
        </Button>
      </Toolbar>
    </>
  )
}
