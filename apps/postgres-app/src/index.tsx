import { createApi, createApp } from '@o/kit'
import React from 'react'
import { postgresIcon } from './postgresIcon'
import { PostgresSettings } from './PostgresSettings'
import { PostgresApi } from './api.node'

export default createApp({
  id: 'postgres',
  name: 'Postgres',
  icon: postgresIcon,
  itemType: 'document', // todo(nate) whats item type for this app?
  settings: app => <PostgresSettings identifier="postgres" app={app} />,
  setup: PostgresSettings,
  sync: {},
  api: createApi<typeof PostgresApi>(),
})
