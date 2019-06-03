import { App, AppDefinition, AppIcon, AppMainView, AppViewProps, createApp, isDataDefinition, removeApp, useActiveAppsWithDefinition, useActiveDataAppsWithDefinition, useAppDefinitions, useAppWithDefinition } from '@o/kit'
import { ApiSearchItem } from '@o/models'
import { Button, Col, FormField, Icon, List, ListItemProps, Section, SubSection, SubTitle } from '@o/ui'
import React, { useCallback, useEffect, useState } from 'react'

import { GraphExplorer } from '../../views/GraphExplorer'
import { ManageApps } from '../../views/ManageApps'
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
  const hasSync = !!def.sync
  const hasClient = !!def.app
  const titles = [hasSync ? 'Data Source' : '', hasClient ? 'Client' : ''].filter(Boolean)
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
    icon: <AppIcon identifier={def.id} colors={['black', 'red']} />,
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
  icon: <AppIcon icon={item.icon} colors={['pink', 'orange']} />,
  groupName: 'Search (App Store)',
  after: item.features.some(x => x === 'graph' || x === 'sync' || x === 'api') ? sourceIcon : null,
  subType: 'add-app',
  subId: item.identifier,
})

export function AppsIndex() {
  const clientApps = useActiveAppsWithDefinition().filter(x => !!x.definition.app)
  const dataApps = useActiveDataAppsWithDefinition()
  const [topApps, setTopApps] = useState<ListItemProps[]>([])
  const [searchResults, setSearchResults] = useState<ListItemProps[]>([])

  useEffect(() => {
    fetch(`https://tryorbit.com/api/apps`)
      .then(res => res.json())
      .then((apps: ApiSearchItem[]) => {
        console.log('top apps', apps)
        setTopApps(
          apps.map(x => ({
            ...appSearchToListItem(x),
            groupName: 'Trending (App Store)',
          })),
        )
      })
  }, [])

  const handleQuery = useCallback(next => {
    let cancel = false
    const query = next.replace(/[^a-z]/gi, '-').replace(/--{1,}/g, '-')
    console.log('search', next, 'query', query)

    fetch(`https://tryorbit.com/api/search/${query}`)
      .then(res => res.json())
      .then((res: ApiSearchItem[]) => {
        if (!cancel) {
          setSearchResults(res.slice(0, 200).map(appSearchToListItem))
        }
      })

    return () => {
      cancel = true
    }
  }, [])

  return (
    <List
      title="Manage Apps"
      subTitle="Use search to find new apps."
      onQueryChange={handleQuery}
      itemProps={{
        iconBefore: true,
      }}
      items={[
        {
          title: 'Apps',
          icon: 'apps',
          subTitle: 'Manage apps',
          subType: 'manage-apps',
        },
        {
          title: 'Graph',
          icon: 'Graph',
          subTitle: 'Explore all GraphQL app APIs',
          subType: 'explorer-graph',
        },
        ...clientApps.map(getAppListItem).map(x => ({ ...x, subType: 'settings' })),
        ...dataApps.map(getAppListItem).map(x => ({
          ...x,
          subType: 'settings',
          after: sourceIcon,
        })),
        {
          selectable: false,
          pad: false,
          children: (
            <Col padding={[38, 8, 16]}>
              <SubTitle>Install Apps</SubTitle>
            </Col>
          ),
        },
        ...useDataAppDefinitions().map(appDefToListItem),
        ...topApps,
        ...searchResults,
      ]}
    />
  )
}

export function AppsMain(props: AppViewProps) {
  const [app, definition] = useAppWithDefinition(+props.subId)

  if (props.subType === 'explorer-graph') {
    return <GraphExplorer />
  }

  if (props.subType === 'manage-apps') {
    return <ManageApps />
  }

  if (!app) {
    return <>hi</>
  }

  if (props.subType === 'add-app') {
    return <AppsMainAddApp identifier={props.subId} />
  }

  return (
    <Section
      backgrounded
      flex={1}
      titleBorder
      titlePad="xxl"
      pad
      icon="cog"
      space
      title={props.title}
      afterTitle={
        app &&
        app.tabDisplay !== 'permanent' && (
          <Button icon="cross" tooltip={`Remove ${props.title}`} onClick={() => removeApp(app)} />
        )
      }
    >
      {!!definition.app && (
        <Section>
          <FormField label="Name and Icon">
            <AppsMainNew app={app} />
          </FormField>
        </Section>
      )}

      {!!definition.settings && (
        <Section title="Settings">
          <AppMainView {...props} viewType="settings" />
        </Section>
      )}

      {!!definition.setup && (
        <Section>
          <SubSection title="App Settings">
            <AppSetupForm id={app ? app.id : undefined} def={definition} />
          </SubSection>
        </Section>
      )}

      {!!definition.app && (
        <Section bordered title="Preview" minHeight={200}>
          preview
          {/* <PreviewApp app={app} /> */}
        </Section>
      )}
    </Section>
  )
}
