import { createApp } from '@o/kit'
import { postgresIcon } from './postgresIcon'
import { PostgresSettings } from './PostgresSettings'
import PostgresApi from './api'

export default createApp({
  id: 'postgres',
  name: 'Postgres',
  icon: postgresIcon,
  itemType: 'document', // todo(nate) whats item type for this app?
  settings: (app) => <PostgresSettings identifier='postgres' app={app}/>,
  setup: PostgresSettings,
  sync: {},
  API: PostgresApi
})
