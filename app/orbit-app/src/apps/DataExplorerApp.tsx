import { App, AppProps, createApp, List, useActiveSyncAppsWithDefinition } from '@o/kit'
import { Section, TitleRow } from '@o/ui'
import React from 'react'
import { SubSection } from '../views/SubSection'
import { getAppListItem } from './apps/getAppListItem'

function DataExplorerIndex() {
  const syncApps = useActiveSyncAppsWithDefinition()
  return <List items={syncApps.map(x => getAppListItem(x, { group: 'Data Apps' }))} />
}

function DataExplorerMain({ identifier }: AppProps) {
  return (
    <Section>
      <TitleRow bordered title="Hello world" />
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
