import { AppIcon, createApp, getAppDefinition, useAppDefinition, useLocationLink } from '@o/kit'
import { Button, Col, Flow, FlowProvide, Form, gloss, IconLabeled, List, ListItemProps, randomAdjective, randomNoun, Scale, SectionPassProps, SelectableGrid, Text, Theme, Toolbar, useBanner, useCreateFlow, useFlow, useForm, View } from '@o/ui'
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

export const SelectableView = gloss<any>(View).theme(({ isSelected }, theme) => ({
  background: isSelected ? theme.background : 'transparent',
  '&:hover': {
    background: isSelected ? theme.background : 'transparent',
  },
}))

function SetupAppCustom() {
  const newAppStore = useNewAppStore()
  const stackNav = useStackNavigator()

  const flow = useCreateFlow({
    initialData: {
      selectedTemplate: null,
    },
  })

  const form = useForm({
    fields: {
      name: {
        name: 'Name',
        type: 'string',
      },
      identifier: {
        name: 'identifier',
        type: 'string',
        value: `${randomAdjective()}${randomNoun()}${Math.round(Math.random() * 10)}`,
      },
    },
  })

  console.log('form', form, form.getValue('name'))

  return (
    <>
      <Col width="70%" height="80%" margin="auto">
        <Flow useFlow={flow}>
          <Flow.Step buttonTitle="Template" title="Choose Template" subTitle="Choose template">
            {({ setData }) => {
              return (
                <Col pad>
                  <SelectableGrid
                    alwaysSelected
                    defaultSelected={0}
                    items={[
                      {
                        label: 'Blank',
                        icon: 'template',
                        subTitle: 'Empty app template',
                      },
                    ]}
                    getItem={(props, { isSelected, select }) => (
                      <Theme alt={isSelected ? 'selected' : undefined}>
                        <SelectableView isSelected={isSelected} onClick={select} borderRadius={10}>
                          <IconLabeled {...props} />
                        </SelectableView>
                      </Theme>
                    )}
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
              <Form useForm={form} />
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
          {/* {flow.step === 0 && <Button onClick={flow.next}>Next</Button>} */}
          <Button
            disabled={!form.getValue('name')}
            alt="confirm"
            onClick={() => {
              newAppStore.setApp(flow.data.identifier)
            }}
            icon="chevron-right"
          >
            Create
          </Button>
        </Toolbar>
      </Scale>
    </>
  )
}

type SetupAppHomeProps = { isEmbedded?: boolean }

export function SetupAppHome(props: SetupAppHomeProps) {
  const installedApps: ListItemProps[] = useUserVisualAppDefinitions().map(def => ({
    title: def.name,
    identifier: def.id,
    groupName: 'Installed apps',
    subTitle: def.description || 'No description',
    icon: <AppIcon identifier={def.id} colors={def.iconColors} />,
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
      <SectionPassProps elevation={10}>
        <Col width="70%" height="80%" margin="auto">
          <Flow
            useFlow={flow}
            afterTitle={
              !props.isEmbedded && (
                <Button onClick={useLocationLink('/app/apps')}>Manage apps</Button>
              )
            }
          >
            <Flow.Step title="Pick app" subTitle="Choose type of app.">
              <List
                searchable
                onQueryChange={search}
                selectable
                alwaysSelected
                onSelect={rows => {
                  const row = rows[0]
                  if (row) {
                    console.log('setting data', row)
                    flow.setData({ selectedAppIdentifier: row.identifier })
                    newAppStore.update({ name: row.title })
                  }
                }}
                itemProps={{
                  iconBefore: true,
                  iconProps: {
                    size: 44,
                  },
                }}
                items={[...installedApps, ...searchedApps, ...topApps]}
              />
            </Flow.Step>
            <Flow.Step title="Customize" subTitle="Give it a name, theme and setup any options.">
              {FlowStepSetup}
            </Flow.Step>
          </Flow>
        </Col>
      </SectionPassProps>

      <SetupAppHomeToolbar {...props} />
    </FlowProvide>
  )
}

const SetupAppHomeToolbar = memo((props: SetupAppHomeProps) => {
  const banner = useBanner()
  const flow = useFlow()
  const stackNav = useStackNavigator()
  const definition = useAppDefinition(flow.data.selectedAppIdentifier)
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
        <Button onClick={flow.next}>
          Customize: <small>{definition.name}</small>
        </Button>
        <Button
          alt="confirm"
          onClick={async () => {
            const definition = await getAppDefinition(flow.data.selectedAppIdentifier)
            installApp(definition, newAppStore.app, banner)
          }}
          icon="chevron-right"
        >
          Add
        </Button>
      </Toolbar>
    </Scale>
  )
})

const FlowStepSetup = memo(() => {
  const flow = useFlow()
  const identifier = flow.data.selectedAppIdentifier
  const appBit = useNewAppBit(flow.data.selectedAppIdentifier)
  return (
    <Col pad flex={1} scrollable="y">
      <Scale size={1.2}>
        <AppsMainNew key={identifier} customizeColor app={appBit} />
      </Scale>
    </Col>
  )
})
