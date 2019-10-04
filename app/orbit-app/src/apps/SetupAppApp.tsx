import { App, AppIcon, command, createApp, getAppDefinition, useLocationLink, useSearchState } from '@o/kit'
import { AppCreateNewCommand, AppDefinition } from '@o/models'
import { Button, Flow, FlowLayoutInline, FlowProvide, Form, IconLabeled, List, ListItemProps, Scale, SectionPassProps, SelectableGrid, SelectableSurface, Stack, Text, Toolbar, useBanner, useCreateFlow, useCreateForm, useFlow, View } from '@o/ui'
import { stringToIdentifier } from '@o/utils'
import React, { memo, useCallback, useLayoutEffect, useMemo } from 'react'

import { createAppBitInActiveSpace, useInstallApp } from '../helpers/installApp'
import { newAppStore } from '../om/stores'
import { useSearchAppStoreApps } from './apps/AppsApp'
import { AppsMainNew } from './apps/AppsMainNew'
import { useTopAppStoreApps } from './apps/useTopAppStoreApps'
import { useUserVisualAppDefinitions } from './orbitApps'
import { StackNavigator, useCreateStackNavigator, useStackNavigator } from './StackNavigator'

export default createApp({
  id: 'setupApp',
  name: 'Add App',
  icon: 'plus',
  app: SetupAppMain,
  viewConfig: {
    transparentBackground: false,
  },
})

function SetupAppMain() {
  const stackNav = useCreateStackNavigator({
    id: 'setupApp',
    defaultItem: {
      id: 'SetupAppHome',
      props: {},
    },
    items: {
      SetupAppHome,
      SetupAppCustom,
    },
  })

  console.log('render setup app...')

  return (
    <App
      actions={
        <>
          <Button
            disabled={stackNav.currentItem && stackNav.currentItem.id === 'SetupAppCustom'}
            coat="action"
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
        </>
      }
    >
      <StackNavigator useNavigator={stackNav} />
    </App>
  )
}

function SetupAppCustom() {
  const banner = useBanner()
  const stackNav = useStackNavigator()!

  const flow = useCreateFlow({
    id: 'setupApp',
    data: {
      selectedTemplate: null,
    },
  })

  const form = useCreateForm({
    fields: {
      name: {
        label: 'Name',
        type: 'text',
        value: '',
      },
      identifier: {
        label: 'Unique ID',
        description: 'You can change this later.',
        type: 'text',
        value: fields => stringToIdentifier(fields.name, '-').toLowerCase(),
      },
    },
  })

  return (
    <>
      <Stack margin="auto" width="90%" flex={1} padding scrollable="y">
        <Flow useFlow={flow} Layout={FlowLayoutInline}>
          <Flow.Step title="Customize" subTitle="Pick a name and ID.">
            <Stack padding>
              <Scale size={1.2}>
                <Form useForm={form} />
              </Scale>
            </Stack>
          </Flow.Step>
          <Flow.Step buttonTitle="Template" title="Template" subTitle="Choose starting template.">
            {({ setData }) => {
              return (
                <Stack padding>
                  <SelectableGrid
                    alwaysSelected
                    defaultSelected={0}
                    items={[
                      {
                        label: 'Blank',
                        template: 'blank',
                        icon: 'square',
                        subTitle: 'Empty app template.',
                      },
                      {
                        label: 'Index/Detail',
                        template: 'index-detail',
                        icon: 'panel-stats',
                        subTitle: 'Sidebar with list controlling main view.',
                      },
                      {
                        label: 'Grid',
                        template: 'grid',
                        icon: 'grid-view',
                        subTitle: 'Grid view, orderable and resizable.',
                      },
                    ]}
                    getItem={(props, { isSelected, select }) => (
                      <SelectableSurface selected={isSelected} onClick={select} borderRadius={10}>
                        <IconLabeled {...props} />
                      </SelectableSurface>
                    )}
                    onSelect={items => {
                      const item = items[0]
                      setData({ selectedTemplate: item.template })
                    }}
                  />
                </Stack>
              )
            }}
          </Flow.Step>
        </Flow>
      </Stack>

      <Scale size="lg">
        <Toolbar>
          <Button coat="action" iconAfter={false} icon="chevron-left" onClick={stackNav.back}>
            Back
          </Button>
          <View flex={1} />
          <Button
            disabled={!form.getValue('name')}
            coat="confirm"
            onClick={async () => {
              const template = flow.data.selectedTemplate
              const name = form.getValue('name')
              const title = `Creating new app ${name}`
              const identifier = form.getValue('identifier')
              let log = ``

              banner.set({
                title,
                message: `Creating app "${name}" with template "${template}".`,
                loading: true,
              })

              const res = await command(
                AppCreateNewCommand,
                {
                  template,
                  name,
                  identifier,
                  icon: 'blank',
                },
                {
                  timeout: 1000 * 60 * 10,
                  onMessage: message => {
                    log += `${message}\n`
                    banner.set({ title, message: log, loading: true })
                  },
                },
              )

              if (res.type === 'error') {
                banner.set({
                  title,
                  type: 'error',
                  message: `${log}\n${res.message}`,
                })
                return
              }

              // go to app
              await createAppBitInActiveSpace({
                identifier,
                name,
              })

              banner.set({
                title,
                type: 'success',
                message: `Successfully created, opening...`,
                timeout: 2,
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

const appDefToListItem = (def: AppDefinition) => {
  return {
    title: def.name,
    identifier: def.id,
    groupName: 'Installed apps',
    icon: <AppIcon identifier={def.id} colors={def.iconColors} />,
    extraData: {
      definition: def,
    },
  }
}

export const SetupAppHome = memo((props: SetupAppHomeProps) => {
  const installedApps: ListItemProps[] = useUserVisualAppDefinitions().map(appDefToListItem)
  const [searchedApps, search] = useSearchAppStoreApps(results =>
    results.filter(res => res.features.some(x => x === 'app')),
  )
  const topApps = useTopAppStoreApps(results =>
    results.filter(
      res =>
        res.features.some(x => x === 'app') &&
        installedApps.every(x => x.identifier !== res.identifier),
    ),
  )

  const flow = useCreateFlow({
    id: 'select-app',
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
        <Stack width="90%" maxHeight="80%" margin="auto" flex={1}>
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
                onSelect={useCallback(rows => {
                  const row = rows[0]
                  if (row) {
                    flow.setData({ selectedAppIdentifier: row.identifier })
                    newAppStore.setApp(row.identifier)
                  }
                }, [])}
                itemProps={useMemo(
                  () => ({
                    iconBefore: true,
                    iconProps: {
                      size: 44,
                    },
                  }),
                  [],
                )}
                items={useMemo(() => [...installedApps, ...searchedApps, ...topApps], [
                  installedApps,
                  searchedApps,
                  topApps,
                ])}
              />
            </Flow.Step>
            <Flow.Step title="Customize" subTitle="Name, theme and setup any options.">
              {FlowStepSetup}
            </Flow.Step>
          </Flow>
        </Stack>
      </SectionPassProps>

      <SetupAppHomeToolbar {...props} />
    </FlowProvide>
  )
})

const SetupAppHomeToolbar = memo((_props: SetupAppHomeProps) => {
  const flow = useFlow()
  const installApp = useInstallApp()
  return (
    <Scale size="lg">
      <Toolbar>
        <View flex={1} />
        {flow.data.selected && (
          <View>
            <Text ellipse alpha={0.65} size={1.2}>
              {flow.data.selected.title}
            </Text>
          </View>
        )}
        {flow.index === 0 ? (
          <Button onClick={flow.next} icon="chevron-right">
            Customize
          </Button>
        ) : (
          <Button
            coat="confirm"
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

  if (!flow.data) {
    throw new Error('No Data?')
  }

  const identifier = flow.data.selectedAppIdentifier

  useLayoutEffect(() => {
    newAppStore.update({ identifier: flow.data.selectedAppIdentifier })
  }, [flow.data.selectedAppIdentifier])

  return (
    <Stack padding flex={1} scrollable="y">
      <Scale size={1.2}>
        <AppsMainNew key={identifier} customizeColor />
      </Scale>
    </Stack>
  )
})
