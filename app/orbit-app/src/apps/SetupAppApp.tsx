import { AppIcon, command, createApp, getAppDefinition, useLocationLink, useSearchState } from '@o/kit'
import { AppCreateNewCommand } from '@o/models'
import { Button, Col, Flow, FlowProvide, Form, gloss, IconLabeled, List, ListItemProps, randomAdjective, randomNoun, Scale, SectionPassProps, SelectableGrid, Text, Theme, Toolbar, useBanner, useCreateFlow, useCreateForm, useFlow, View } from '@o/ui'
import React, { memo, useLayoutEffect } from 'react'

import { createAppBitInActiveSpace, useInstallApp } from '../helpers/installApp'
import { newAppStore, useNewAppStore } from '../om/stores'
import { useSearchAppStoreApps, useTopAppStoreApps } from './apps/AppsApp'
import { AppsMainNew } from './apps/AppsMainNew'
import { useUserVisualAppDefinitions } from './orbitApps'
import { StackNavigator, useStackNavigator } from './StackNavigator'

export default createApp({
  id: 'setupApp',
  name: 'Add App',
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
  const banner = useBanner()
  const newAppStore = useNewAppStore()
  const stackNav = useStackNavigator()

  const flow = useCreateFlow({
    data: {
      selectedTemplate: null,
    },
  })

  const form = useCreateForm({
    fields: {
      name: {
        name: 'Name',
        type: 'text' as const,
      },
      packageId: {
        name: 'Package ID',
        type: 'text' as const,
        value: `${randomAdjective()}${randomNoun()}${Math.round(Math.random() * 10)}`,
      },
    },
  })

  return (
    <>
      <Col width="90%" height="90%" margin="auto">
        <Flow useFlow={flow}>
          <Flow.Step buttonTitle="Template" title="Choose Template" subTitle="Choose template">
            {({ setData }) => {
              return (
                <Col padding>
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
                      console.log('set item', item)
                      newAppStore.setApp(flow.data.identifier)
                      setData(item)
                    }}
                  />
                </Col>
              )
            }}
          </Flow.Step>

          <Flow.Step title="Customize" subTitle="Your app settings.">
            <Col padding>
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
          <Button
            disabled={!form.getValue('name')}
            alt="confirm"
            onClick={async () => {
              const template = flow.data.selectedTemplate
              const name = form.getValue('name')
              const identifier = form.getValue('identifier')

              banner.set({
                message: `Creating app "${name}" with template "${template}".`,
              })

              const res = await command(AppCreateNewCommand, {
                template,
                name,
                identifier,
                icon: 'blank',
              })

              if (res.type === 'error') {
                banner.set({
                  type: 'error',
                  message: res.message,
                })
                return
              }

              // go to app
              console.warn('should go to app')
              createAppBitInActiveSpace({
                identifier,
              })

              banner.set({
                type: 'success',
                message: `Successfully created, opening...`,
              })
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
    icon: <AppIcon identifier={def.id} colors={def.iconColors} />,
  }))
  const [searchedApps, search] = useSearchAppStoreApps(results =>
    results.filter(res => res.features.some(x => x === 'app')),
  )
  const topApps = useTopAppStoreApps(results =>
    results.filter(res => res.features.some(x => x === 'app')),
  )

  const flow = useCreateFlow({
    data: {
      selectedAppIdentifier: null,
    },
  })

  useSearchState({
    onChange(state) {
      if (!state.query) {
        flow.next()
      }
    },
    onEvent: 'enter',
  })

  return (
    <FlowProvide value={flow}>
      <SectionPassProps elevation={10}>
        <Col width="90%" height="80%" margin="auto">
          <Flow
            useFlow={flow}
            afterTitle={
              !props.isEmbedded && (
                <Button onClick={useLocationLink('/app/apps')}>Manage apps</Button>
              )
            }
          >
            <Flow.Step title="Add app" subTitle="Add a visual app to workspace.">
              <List
                searchable
                onQueryChange={search}
                selectable
                alwaysSelected
                onSelect={rows => {
                  const row = rows[0]
                  if (row) {
                    flow.setData({ selectedAppIdentifier: row.identifier })
                    newAppStore.setApp(row.identifier)
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
            <Flow.Step title="Customize" subTitle="Name, theme and setup any options.">
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
  const flow = useFlow()
  const stackNav = useStackNavigator()
  // const definition = useAppDefinition(flow.data.selectedAppIdentifier)
  const installApp = useInstallApp()
  return (
    <Scale size="lg">
      <Toolbar>
        {!props.isEmbedded && (
          <Button
            alt="action"
            onClick={() => {
              stackNav.navigateTo({
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
      </Toolbar>
    </Scale>
  )
})

const FlowStepSetup = memo(() => {
  const flow = useFlow()
  const identifier = flow.data.selectedAppIdentifier

  useLayoutEffect(() => {
    newAppStore.update({ identifier: flow.data.selectedAppIdentifier })
  }, [flow.data.selectedAppIdentifier])

  return (
    <Col padding flex={1} scrollable="y">
      <Scale size={1.2}>
        <AppsMainNew key={identifier} customizeColor />
      </Scale>
    </Col>
  )
})
