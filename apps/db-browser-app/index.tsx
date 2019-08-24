import { AppModel, createApp, useModel, useApp } from '@o/kit'
import PostgresApp from "@o/postgres-app"
import { DataInspector, Layout, Pane, Scale, Table, useActiveSearchQuery } from '@o/ui'
import React from 'react'

export default createApp({
  id: 'db-browser-app',
  name: 'Database Browser',
  icon: 'layout',
  iconColors: ['rgb(177, 13, 201)', 'rgb(157, 13, 191)'],
  app: DatabaseBrowserApp,
})

function DatabaseBrowserApp() {
  const [bit] = useModel(AppModel, { where: { identifier: "postgres" } })
  const postgres = useApp(PostgresApp, bit)
  const staff = postgres.query('SELECT * from staff;')
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
        <Pane title="Elements" resizable padding collapsable>
          <DataInspector
            data={items[0]}
          />
        </Pane>
        </Pane>
      </Layout>
    </Scale>
  )
}
