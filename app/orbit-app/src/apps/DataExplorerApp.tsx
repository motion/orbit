import { App, AppProps, createApp, List, useActiveSyncAppsWithDefinition, useApp } from '@o/kit'
import { Section } from '@o/ui'
import React from 'react'
import { SubSection } from '../views/SubSection'
import { getAppListItem } from './apps/getAppListItem'

function DataExplorerIndex() {
  const syncApps = useActiveSyncAppsWithDefinition()
  return <List items={syncApps.map(x => getAppListItem(x, { group: 'Data Apps' }))} />
}

function DataExplorerMain({ identifier, subId }: AppProps) {
  const [app] = useApp(+subId)
  // TODO suspense
  if (!app) return null
  return (
    <Section title={app.appName} subTitle={app.name} icon={app.icon}>
      <SubSection title="App Settings">test me out {identifier}</SubSection>
    </Section>
  )
}

export default createApp({
  id: 'data-explorer',
  name: 'Data Explorer',
  icon: '',
  app: props => (
    <App index={<DataExplorerIndex />}>
      <DataExplorerMain {...props} />
    </App>
  ),
})
