import { AppModel, createApp, useModel, useApp } from '@o/kit'
import PostgresApp from "@o/postgres-app"
import { DataInspector, Layout, Pane, Scale, Table, useActiveSearchQuery } from '@o/ui'
import React, { useMemo, useState } from 'react'

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

  const [selected, setSelected] = useState([])
  const [query, setQuery] = useState('')
  const items = useMemo(() => postgres.query(query), [query])
  const selectedItems = useMemo(() => items.filter((_, i) => selected.includes(i)), [selected, items])

  const onSelect = (_: any[], indicies: any[]): void => {
    setSelected(indicies)
  }

  return (
    <Scale size={1}>
      <Layout type="row">
        <Pane flex={3} collapsable title="Inspect" resizable>
          <Table
            columnSizes={{ username: 120 }}
            searchable
            query={useActiveSearchQuery()}
            onSelect={onSelect}
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
            data={selectedItems.length === 1 ? selectedItems[0] : selectedItems}
          />
        </Pane>
      </Layout>
    </Scale>
  )
}
