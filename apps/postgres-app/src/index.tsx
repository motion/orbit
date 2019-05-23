import { createApp } from '@o/kit'

import PostgresApi from './api.node'
import { graph } from './graph.node'
import { postgresIcon } from './postgresIcon'

export default createApp({
  id: 'postgres',
  name: 'Postgres',
  icon: postgresIcon,
  itemType: 'document',
  api: PostgresApi,
  graph,
  setup: {
    hostname: {
      name: 'Hostname',
      required: true,
    },
    username: {
      name: 'Username',
      required: true,
    },
    password: {
      name: 'Password',
      required: true,
    },
    port: {
      name: 'Port',
      required: true,
    },
    database: {
      name: 'Database',
      required: true,
    },
  },
})
