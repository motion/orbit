import { AppIcon, createApp, useLocationLink } from '@o/kit'
import { Button, Col, Flow, Form, IconLabeled, List, ListItemProps, randomAdjective, randomNoun, Scale, SelectableGrid, Text, Toolbar, useFlow, View } from '@o/ui'
import React, { useState } from 'react'

import { useOm } from '../om/om'
import { useSearchAppStoreApps, useTopAppStoreApps } from './apps/AppsApp'
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
      key={Math.random()}
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
  const flow = useFlow({
    initialData: {
      selectedTemplate: null,
    },
  })
  return (
    <>
      <Col width="70%" margin="auto">
        <Flow useFlow={flow}>
          <Flow.Step title="Template" subTitle="Choose template">
            {({ setData }) => {
              return (
                <Col pad>
                  <SelectableGrid
                    items={[
                      {
                        label: 'Blank',
                        icon: 'template',
                        subTitle: 'Empty app template',
                      },
                    ]}
                    getItem={props => <IconLabeled {...props} />}
                    onSelect={item => {
                      setData(item)
                    }}
                  />
                </Col>
              )
            }}
          </Flow.Step>

          <Flow.Step title="Setup" subTitle="Give it a name and icon">
            <Col pad>
              <Form
                fields={{
                  name: {
                    name: 'Name',
                    type: 'string',
                  },
                  identifier: {
                    name: 'identifier',
                    type: 'string',
                    value: `${randomAdjective()}${randomNoun()}${Math.round(Math.random() * 10)}`,
                  },
                }}
              />
            </Col>
          </Flow.Step>
        </Flow>
      </Col>

      <Scale size="lg">
        <Toolbar>
          <Button alt="action" iconAfter={false} icon="chevron-left" onClick={stackNav.back}>
            Back
          </Button>
          <View flex={1} />
          <Button
            size={1.4}
            alt="confirm"
            onClick={() => {
              actions.setupApp.create(flow.data.identifier)
            }}
            icon="chevron-right"
          >
            Start
          </Button>
        </Toolbar>
      </Scale>
    </>
  )
}

function SetupAppHome() {
  const { actions } = useOm()
  const stackNav = useStackNavigator()
  const installedApps: ListItemProps[] = useUserVisualAppDefinitions().map(app => ({
    title: app.name,
    identifier: app.id,
    groupName: 'Installed apps',
    subTitle: app.description || 'No description',
    icon: <AppIcon identifier={app.id} />,
    iconBefore: true,
    iconProps: {
      size: 44,
    },
  }))
  const [searchedApps, search] = useSearchAppStoreApps(results =>
    results.filter(res => res.features.some(x => x === 'app')),
  )
  const topApps = useTopAppStoreApps(results =>
    results.filter(res => res.features.some(x => x === 'app')),
  )

  const [selected, setSelected] = useState<ListItemProps>(null)
  const flow = useFlow({
    initialData: {
      selectedApp: null,
    },
  })

  return (
    <>
      <Col width="70%" height="70%" margin="auto">
        <Flow
          useFlow={flow}
          afterTitle={<Button onClick={useLocationLink('/app/apps')}>Manage apps</Button>}
        >
          <Flow.Step title="Pick app" subTitle="Choose type of app.">
            <List
              searchable
              onQueryChange={search}
              selectable
              alwaysSelected
              onSelect={rows => setSelected(rows[0])}
              itemProps={{
                iconBefore: true,
              }}
              items={[...installedApps, ...searchedApps, ...topApps]}
            />
          </Flow.Step>

          <Flow.Step title="Configure" subTitle="Give it a name, theme and setup any options.">
            <div>hi</div>
          </Flow.Step>
        </Flow>
      </Col>

      <Scale size="lg">
        <Toolbar>
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
            <View>
              <Text ellipse alpha={0.65} size={1.2}>
                {selected.title}
              </Text>
            </View>
          )}
          <Button size={1.4} alt="confirm" onClick={flow.nextStep} icon="chevron-right">
            Configure
          </Button>
        </Toolbar>
      </Scale>
    </>
  )
}
