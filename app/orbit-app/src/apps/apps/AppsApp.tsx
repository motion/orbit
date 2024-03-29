import { App, AppDefinition, AppIcon, AppMainView, AppViewProps, command, createApp, CurrentAppBitContext, isDataDefinition, removeApp, useActiveAppsWithDefinition, useActiveDataAppsWithDefinition, useAppWithDefinition } from '@o/kit'
import { ApiSearchItem, AppBit, AppBuildCommand } from '@o/models'
import { Desktop } from '@o/stores'
import { Button, Card, CenteredText, createBanner, DefinitionList, Icon, List, ListItemProps, Section, Stack, SubTitle, useAsyncFn, useBanner } from '@o/ui'
import React, { useCallback, useState } from 'react'

import { useOm } from '../../om/om'
import { ManageApps } from '../../views/ManageApps'
import { useUserAppDefinitions } from '../orbitApps'
import { AppSetupForm } from './AppSetupForm'
import { AppsMainAddApp } from './AppsMainAddApp'
import { AppsMainNew } from './AppsMainNew'
import { getAppListItem } from './getAppListItem'
import { useTopAppStoreApps } from './useTopAppStoreApps'

export default createApp({
  id: 'apps',
  name: 'Apps',
  icon: 'layout-grid',
  app: props => {
    return (
      <App index={<AppsIndex />}>
        <AppsMain {...props} />
      </App>
    )
  },
})

function AppsIndex() {
  const allApps = useActiveAppsWithDefinition()
  const clientApps = allApps.filter(x => !!x.definition.app)
  const dataApps = useActiveDataAppsWithDefinition()
  const topApps = useTopAppStoreApps()
  const [searchItems, search] = useSearchAppStoreApps()
  const [hasSearch, setHasSearch] = useState(false)

  const myApps = [
    ...clientApps.map(getAppListItem).map(x => ({ ...x, subType: 'settings' })),
    ...dataApps.map(getAppListItem).map(x => ({
      ...x,
      subType: 'settings',
      after: sourceIcon,
    })),
  ]

  const localApps = useUserAppDefinitions()

  return (
    <List
      alwaysSelected
      onQueryChange={useCallback(query => {
        setHasSearch(!!query)
        search(query)
      }, [])}
      itemProps={{
        iconBefore: true,
      }}
      items={[
        {
          title: 'Manage Apps',
          icon: 'apps',
          subTitle: 'View, organize installed apps',
          subType: 'manage-apps',
        },
        ...(myApps.length
          ? myApps
          : [
              {
                selectable: false,
                title: 'No apps installed, yet!',
              },
            ]),

        {
          selectable: false,
          padding: false,
          children: (
            <Stack padding={[38, 8, 16]}>
              <SubTitle>Install</SubTitle>
            </Stack>
          ),
        },
        ...localApps.map(setupAppListItem),
        ...(hasSearch ? [] : topApps),
        ...searchItems,
      ]}
    />
  )
}

function AppsMain(props: AppViewProps) {
  if (props.subType === 'add-app') {
    return <AppsMainAddApp identifier={props.subId || ''} />
  }

  if (props.subType === 'settings') {
    return (
      <CurrentAppBitContext.PassProps id={+props.subId!}>
        <AppSettings key={props.subId} appId={+props.subId!} />
      </CurrentAppBitContext.PassProps>
    )
  }

  return <ManageApps />
}

let isRebuilding = {}
async function rebuildApp(app: AppBit) {
  if (isRebuilding[app.identifier!]) return
  isRebuilding[app.identifier!] = true
  const banner = createBanner()
  const title = `Rebulding ${app.name}`
  const res = await command(
    AppBuildCommand,
    {
      projectRoot: Desktop.state.workspaceState.appMeta[app.identifier!].directory,
      force: true,
    },
    {
      onMessage(message) {
        banner.set({ title, message })
      },
    },
  )
  banner.set({
    title,
    type: res.type,
    message: res.message,
    timeout: res.type === 'success' ? 5 : Infinity,
  })
  isRebuilding[app.identifier!] = false
}

function AppSettings(props: { appId: number }) {
  const [app, definition] = useAppWithDefinition(props.appId)
  const banner = useBanner()
  const om = useOm()
  const buildStatus = om.state.develop.buildStatus.find(x => x.identifier === app!.identifier)

  if (!app || !definition) {
    return <CenteredText>No app/definition</CenteredText>
  }

  return (
    <Section
      flex={1}
      scrollable="y"
      titleBorder
      icon={<AppIcon identifier={app.identifier} colors={app.colors} />}
      space
      padding
      title={`App: ${app.name}`}
      subTitle={`Name: ${app.name} · Definition name: ${definition.name}`}
      afterTitle={
        app &&
        app.tabDisplay !== 'permanent' && (
          <Button
            icon="cross"
            tooltip={`Remove ${app.name}`}
            onClick={() => removeApp(app, banner)}
          >
            Remove
          </Button>
        )
      }
    >
      {!!definition.app && (
        <Card title="Customize" padding titlePadding="md">
          <AppsMainNew customizeColor app={app} />
        </Card>
      )}

      {!!definition.setup && (
        <Card title="App Settings" padding titlePadding="md">
          <AppSetupForm id={app ? app.id : false} def={definition} />
        </Card>
      )}

      {!!definition.settings && (
        <Card minHeight={400} title="Data Settings" titlePadding="md">
          <AppMainView identifier={definition.id} viewType="settings" />
        </Card>
      )}

      {!!buildStatus && (
        <Card
          title="Build Status"
          padding
          afterTitle={<Button onClick={() => rebuildApp(app)}>Rebuild</Button>}
        >
          <DefinitionList row={buildStatus} />
        </Card>
      )}
    </Section>
  )
}

const sourceIcon = <Icon opacity={0.5} size={12} name="database" />

export const appSearchToListItem = (item: ApiSearchItem): ListItemProps => ({
  title: item.name,
  subTitle: item.description.slice(0, 300) || 'No description',
  icon: <AppIcon icon={item.icon} />,
  groupName: 'Search (App Store)',
  after: item.features.some(x => x === 'graph' || x === 'sync' || x === 'api') ? sourceIcon : null,
  subType: 'add-app',
  subId: item.identifier,
  extraData: {
    definition: item,
  },
})

export async function searchApps(query: string): Promise<ApiSearchItem[]> {
  query = query.replace(/[^a-z]/gi, '-').replace(/--{1,}/g, '-')
  return await fetch(`https://tryorbit.com/api/search/${query}`).then(res => res.json())
}

export type FilterSearchItems = (items: ApiSearchItem[]) => ApiSearchItem[]

export function useSearchAppStoreApps(filterFn: FilterSearchItems = _ => _) {
  const [searchResults, search] = useAsyncFn(searchApps)
  const results: ListItemProps[] = searchResults.value
    ? filterFn(searchResults.value).map(x => ({ ...appSearchToListItem(x), disableFilter: true }))
    : []
  return [results, search] as const
}

function getDescription(def: AppDefinition) {
  const hasData = isDataDefinition(def)
  const hasClient = !!def.app
  const titles = [hasData ? 'Data Source' : '', hasClient ? 'Client' : ''].filter(Boolean)
  return titles.join(', ')
}

export function setupAppListItem(def: AppDefinition): ListItemProps {
  return {
    key: `install-${def.id}`,
    groupName: 'Setup (Local)',
    title: def.name,
    icon: <AppIcon identifier={def.id} />,
    subTitle: getDescription(def) || 'No Description',
    after: sourceIcon,
    identifier: 'apps',
    subType: 'add-app',
    subId: def.id,
  }
}
