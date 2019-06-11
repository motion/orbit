import { AppIcon, createApp, getAppDefinition, useLocationLink } from '@o/kit'
import { Button, Col, Flow, FlowProvide, Form, IconLabeled, List, ListItemProps, randomAdjective, randomNoun, Scale, SelectableGrid, Text, Toolbar, useCreateFlow, useFlow, View } from '@o/ui'
import React, { memo } from 'react'

import { installApp, useNewAppBit } from '../helpers/installApp'
import { newAppStore, useNewAppStore } from '../om/stores'
import { useSearchAppStoreApps, useTopAppStoreApps } from './apps/AppsApp'
import { AppsMainNew } from './apps/AppsMainNew'
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
  const newAppStore = useNewAppStore()
  const stackNav = useStackNavigator()
  const flow = useCreateFlow({
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
              newAppStore.setApp(flow.data.identifier)
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

type SetupAppHomeProps = { isEmbedded?: boolean }

export function SetupAppHome(props: SetupAppHomeProps) {
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

  const flow = useCreateFlow({
    initialData: {
      selectedAppIdentifier: null,
    },
  })

  return (
    <FlowProvide value={flow}>
      <Col width="70%" height="70%" margin="auto">
        <Flow
          useFlow={flow}
          afterTitle={
            !props.isEmbedded && <Button onClick={useLocationLink('/app/apps')}>Manage apps</Button>
          }
        >
          <Flow.Step title="Pick app" subTitle="Choose type of app.">
            <List
              searchable
              onQueryChange={search}
              selectable
              alwaysSelected
              onSelect={rows => {
                if (rows[0]) {
                  console.log('setting data', rows[0].identifier)
                  flow.setData({ selectedAppIdentifier: rows[0].identifier })
                }
              }}
              itemProps={{
                iconBefore: true,
              }}
              items={[...installedApps, ...searchedApps, ...topApps]}
            />
          </Flow.Step>

          <Flow.Step title="Configure" subTitle="Give it a name, theme and setup any options.">
            {FlowStepSetup}
          </Flow.Step>
        </Flow>
      </Col>

      <SetupAppHomeToolbar {...props} />
    </FlowProvide>
  )
}

const SetupAppHomeToolbar = memo((props: SetupAppHomeProps) => {
  const flow = useFlow()
  const stackNav = useStackNavigator()
  return (
    <Scale size="lg">
      <Toolbar>
        {!props.isEmbedded && (
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
        )}
        <View flex={1} />
        {flow.data.selected && (
          <View>
            <Text ellipse alpha={0.65} size={1.2}>
              {flow.data.selected.title}
            </Text>
          </View>
        )}
        {flow.index === 0 && (
          <Button alt="confirm" onClick={flow.next} icon="chevron-right">
            Configure
          </Button>
        )}
        {flow.index === 1 && (
          <Button
            alt="confirm"
            onClick={async () => {
              const definition = await getAppDefinition(flow.data.selectedAppIdentifier)
              installApp(definition, newAppStore.app)
            }}
            icon="chevron-right"
          >
            Add
          </Button>
        )}
      </Toolbar>
    </Scale>
  )
})

const FlowStepSetup = memo(() => {
  const flow = useFlow()
  const appBit = useNewAppBit(flow.data.selectedAppIdentifier)
  return (
    <Col pad flex={1} scrollable="y">
      <Scale size={1.2}>
        <AppsMainNew customizeColor app={appBit} />
      </Scale>
    </Col>
  )
})
