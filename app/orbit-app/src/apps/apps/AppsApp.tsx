import {
  App,
  AppDefinition,
  AppMainView,
  AppProps,
  createApp,
  Icon,
  removeApp,
  useActiveApps,
  useActiveAppsWithDefinition,
  useActiveSpace,
  useActiveSyncAppsWithDefinition,
  useAppDefinitions,
  useAppWithDefinition,
} from '@o/kit'
import { Button, Form, FormField, List, Section, SubSection } from '@o/ui'
import React from 'react'

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

export function AppsIndex() {
  const [activeSpace] = useActiveSpace()
  const activeApps = useActiveApps()
  const allSourceDefinitions = useAppDefinitions().filter(x => !!x.sync || !!x.setup)
  const clientApps = useActiveAppsWithDefinition().filter(x => !x.definition.sync)
  const syncApps = useActiveSyncAppsWithDefinition()

  if (!activeSpace || !activeApps.length) {
    return null
  }

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
        ...syncApps.map(getAppListItem).map(x => ({
          ...x,
          group: 'Source Settings',
          subType: 'settings',
          after: sourceIcon,
        })),
        ...allSourceDefinitions.map(def => ({
          key: `install-${def.id}`,
          group: 'Install App',
          title: def.name,
          icon: def.id,
          subTitle: getDescription(def) || 'No Description',
          after: sourceIcon,
          extraData: {
            identifier: 'apps',
            subType: 'add-app',
            subId: def.id,
          },
        })),
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
      <Section>
        <FormField label="Name and Icon">
          <AppsMainNew />
        </FormField>
      </Section>

      {definition.settings && (
        <Section title="Settings">
          <AppMainView {...props} viewType="settings" />
        </Section>
      )}

      {definition.instanceSettings && (
        <Section>
          <SubSection title="App Settings">
            <Form />
          </SubSection>
        </Section>
      )}

      <Section bordered title="Preview" minHeight={200}>
        preview
        {/* <PreviewApp app={app} /> */}
      </Section>
    </Section>
  )
}
