import { createApi, createApp } from '@o/kit'

import { PostgresApi } from './api.node'
import { graph } from './graph.node'
import { postgresIcon } from './postgresIcon'
import { PostgresSettings } from './PostgresSettings'

export default createApp({
  id: 'postgres',
  name: 'Postgres',
  icon: postgresIcon,
  itemType: 'document',
  settings: PostgresSettings,
  setup: PostgresSettings,
  sync: {},
  api: createApi<typeof PostgresApi>(),
  graph,
})
