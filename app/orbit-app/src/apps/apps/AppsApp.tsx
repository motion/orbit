import { App, AppDefinition, AppMainView, AppProps, createApp, Icon, removeApp, useActiveAppsWithDefinition, useActiveDataAppsWithDefinition, useAppDefinitions, useAppWithDefinition } from '@o/kit'
import { Button, FormField, List, ListItemProps, Section, SubSection } from '@o/ui'
import React from 'react'

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

export function useInstallableItems(): ListItemProps[] {
  return useAppDefinitions()
    .filter(x => !!x.sync || !!x.setup)
    .map(def => ({
      key: `install-${def.id}`,
      group: 'Install App',
      title: def.name,
      icon: def.id,
      subTitle: getDescription(def) || 'No Description',
      after: sourceIcon,
      identifier: 'apps',
      subType: 'add-app',
      subId: def.id,
    }))
}

export function AppsIndex() {
  const clientApps = useActiveAppsWithDefinition().filter(x => !!x.definition.app)
  const dataApps = useActiveDataAppsWithDefinition()
  return (
    <List
      title="Manage Apps"
      subTitle="Use search to find new apps."
      itemProps={{
        iconBefore: true,
        iconSize: 36,
      }}
      items={[
        ...clientApps
          .map(getAppListItem)
          .map(x => ({ ...x, group: 'App Settings', subType: 'settings' })),
        ...dataApps.map(getAppListItem).map(x => ({
          ...x,
          group: 'Source Settings',
          subType: 'settings',
          after: sourceIcon,
        })),
        ...useInstallableItems(),
      ]}
    />
  )
}

export function AppsMain(props: AppProps) {
  const [app, definition] = useAppWithDefinition(+props.subId)

  if (!app) {
    return null
  }

  if (props.subType === 'add-app') {
    return <AppsMainAddApp identifier={props.subId} />
  }

  return (
    <Section
      backgrounded
      titleBorder
      padInner
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
