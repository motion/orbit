import { App, AppDefinition, AppIcon, AppMainView, AppViewProps, createApp, isDataDefinition, removeApp, useActiveAppsWithDefinition, useActiveDataAppsWithDefinition, useAppDefinitions, useAppWithDefinition } from '@o/kit'
import { ApiSearchItem } from '@o/models'
import { Button, Col, Icon, List, ListItemProps, Section, SubSection, SubTitle, useAsync, useAsyncFn } from '@o/ui'
import React from 'react'

import { GraphExplorer } from '../../views/GraphExplorer'
import { ManageApps } from '../../views/ManageApps'
import { useUserAppDefinitions } from '../orbitApps'
import { AppSetupForm } from './AppSetupForm'
import { AppsMainAddApp } from './AppsMainAddApp'
import { AppsMainNew } from './AppsMainNew'
import { getAppListItem } from './getAppListItem'

export default createApp({
  id: 'apps',
  name: 'Apps',
  icon: '',
  app: props => (
    <App index={<AppsIndex />}>
      <AppsMain {...props} />
    </App>
  ),
})

function getDescription(def: AppDefinition) {
  const hasData = isDataDefinition(def)
  const hasClient = !!def.app
  const titles = [hasData ? 'Data Source' : '', hasClient ? 'Client' : ''].filter(Boolean)
  return titles.join(', ')
}

const sourceIcon = <Icon opacity={0.5} size={12} name="database" />

export function useDataAppDefinitions() {
  return useAppDefinitions().filter(x => isDataDefinition(x))
}

export const appDefToListItem = (def: AppDefinition): ListItemProps => {
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

const appSearchToListItem = (item: ApiSearchItem): ListItemProps => ({
  title: item.name,
  subTitle: item.description.slice(0, 300),
  icon: <AppIcon icon={item.icon} />,
  groupName: 'Search (App Store)',
  after: item.features.some(x => x === 'graph' || x === 'sync' || x === 'api') ? sourceIcon : null,
  subType: 'add-app',
  subId: item.identifier,
})

export async function searchApps(query: string): Promise<ApiSearchItem[]> {
  query = query.replace(/[^a-z]/gi, '-').replace(/--{1,}/g, '-')
  return await fetch(`https://tryorbit.com/api/search/${query}`).then(res => res.json())
}

type FilterSearchItems = (items: ApiSearchItem[]) => ApiSearchItem[]

export function useSearchAppStoreApps(filterFn: FilterSearchItems = _ => _) {
  const [searchResults, search] = useAsyncFn(searchApps)
  const results: ListItemProps[] = searchResults.value
    ? filterFn(searchResults.value).map(x => ({ ...appSearchToListItem(x), disableFilter: true }))
    : []
  return [results, search] as const
}

export function useTopAppStoreApps(
  filterFn: FilterSearchItems = _ => _,
  fallback: ListItemProps = {
    selectable: false,
    children: <SubTitle>Loading app store</SubTitle>,
  },
): ListItemProps[] {
  const topApps = useAsync<ApiSearchItem[]>(() =>
    fetch(`https://tryorbit.com/api/apps`).then(res => res.json()),
  )
  const filtered = filterFn(topApps.value || [])
  const withFallback = filtered.length ? filtered.map(appSearchToListItem) : [fallback]
  return withFallback.map(x => ({
    ...x,
    groupName: 'Trending (App Store)',
  }))
}

export function AppsIndex() {
  const allApps = useActiveAppsWithDefinition()
  const clientApps = allApps.filter(x => !!x.definition.app)
  const dataApps = useActiveDataAppsWithDefinition()
  const topApps = useTopAppStoreApps()
  const [searchItems, search] = useSearchAppStoreApps()

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
      className="hello-world"
      title="Manage Apps"
      subTitle="Use search to find new apps."
      onQueryChange={search}
      itemProps={{
        iconBefore: true,
      }}
      items={[
        {
          title: 'Organize',
          icon: 'apps',
          subTitle: 'View and organize installed apps',
          subType: 'manage-apps',
        },
        {
          title: 'Graph',
          icon: 'Graph',
          subTitle: 'Explore all GraphQL app APIs',
          subType: 'explorer-graph',
        },

        {
          selectable: false,
          pad: false,
          children: (
            <Col padding={[38, 8, 16]}>
              <SubTitle>App Settings</SubTitle>
            </Col>
          ),
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
          pad: false,
          children: (
            <Col padding={[38, 8, 16]}>
              <SubTitle>Install Apps</SubTitle>
            </Col>
          ),
        },
        ...localApps.map(appDefToListItem),
        ...topApps,
        ...searchItems,
      ]}
    />
  )
}

export function AppsMain(props: AppViewProps) {
  if (props.subType === 'explorer-graph') {
    return <GraphExplorer />
  }

  if (props.subType === 'manage-apps') {
    return <ManageApps />
  }

  if (props.subType === 'add-app') {
    return <AppsMainAddApp identifier={props.subId} />
  }

  return <AppSettings appId={+props.subId} />
}

function AppSettings(props: { appId: number }) {
  const [app, definition] = useAppWithDefinition(props.appId)

  return (
    <Section
      flex={1}
      titleBorder
      titlePad="lg"
      pad
      icon={<AppIcon identifier={app.identifier} colors={app.colors} />}
      space
      title={app.name}
      afterTitle={
        app &&
        app.tabDisplay !== 'permanent' && (
          <Button icon="cross" tooltip={`Remove ${app.name}`} onClick={() => removeApp(app)}>
            Remove
          </Button>
        )
      }
    >
      {!!definition.app && <AppsMainNew customizeColor app={app} />}

      {!!definition.settings && (
        <Section title="Settings">
          <AppMainView {...props} viewType="settings" />
        </Section>
      )}

      {!!definition.setup && (
        <SubSection title="App Settings">
          <AppSetupForm id={app ? app.id : false} def={definition} />
        </SubSection>
      )}
    </Section>
  )
}
