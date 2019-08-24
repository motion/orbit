import { AppModel, createApp, useModel, useApp } from '@o/kit'
import PostgresApp from "@o/postgres-app"
import { DataInspector, Layout, Pane, Scale, Table, useActiveSearchQuery } from '@o/ui'
import React, { useState } from 'react'

export default createApp({
  id: 'db-browser-app',
  name: 'Database Browser',
  icon: 'layout',
  iconColors: ['rgb(177, 13, 201)', 'rgb(157, 13, 191)'],
  app: DatabaseBrowserApp,
})

function QueryInput({ onBlur }) {
  const [localQuery, setLocalQuery] = useState('')
  return (
    <div>
      <input type="text" value={localQuery} onChange={e => setLocalQuery(e.target.value)} onBlur={onBlur} />
    </div>
  )
}

function DatabaseBrowserApp() {
  const [bit] = useModel(AppModel, { where: { identifier: "postgres" } })
  const postgres = useApp(PostgresApp, bit)

  const [query, setQuery] = useState('')
  const staff = postgres.query(query)
  const items = staff

  return (
    <Scale size={1}>
      <Layout type="row">
        <Pane flex={3} collapsable title="Inspect" resizable>
          <Table
            columnSizes={{ username: 120 }}
            searchable
            query={useActiveSearchQuery()}
            selectable="multi"
            shareable
            items={items}
          />
        </Pane>
        <Pane>
          <QueryInput onBlur={(e: React.FocusEvent<HTMLInputElement>): void => setQuery(e.target.value)}/>
        </Pane>
        <Pane title="Elements" resizable padding collapsable>
          <DataInspector
            data={items[0]}
          />
        </Pane>
      </Layout>
    </Scale>
  )
}
