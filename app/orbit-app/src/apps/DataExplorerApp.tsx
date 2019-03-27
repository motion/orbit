import { App, AppProps, createApp, List, useActiveSyncAppsWithDefinition, useApp } from '@o/kit'
import { Button, Label, Section, Space } from '@o/ui'
import { remove } from 'lodash'
import React, { useState } from 'react'
import { getAppListItem } from './apps/getAppListItem'

function DataExplorerIndex() {
  const syncApps = useActiveSyncAppsWithDefinition()
  return <List items={syncApps.map(x => getAppListItem(x, { group: 'Data Apps' }))} />
}

function DataExplorerMain({ subId }: AppProps) {
  const [app] = useApp(+subId)
  const [queries, setQueries] = useState([{ id: 0, name: 'My Query' }])

  // TODO suspense
  if (!app) return null

  return (
    <Section padded title={app.appName} subTitle={app.name} icon={app.icon}>
      {queries.map(query => (
        <Section
          key={query.id}
          bordered
          title={query.name}
          afterTitle={
            <>
              <Button
                icon="simremove"
                onClick={() => setQueries(remove(queries, x => x.id !== query.id))}
              />
            </>
          }
        >
          <Label>Query</Label>
          <textarea />

          <Label>Result</Label>
          <textarea />
        </Section>
      ))}

      <Space />
      <Space />

      <Button
        alt="confirm"
        size={1.5}
        onClick={() => setQueries([...queries, { id: Math.random(), name: 'My Query' }])}
      >
        Add query
      </Button>
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
