import { createApp } from '@o/kit'
import React from 'react'
import PostgresApi from './api'
import { postgresIcon } from './postgresIcon'
import { PostgresSettings } from './PostgresSettings'

export default createApp({
  id: 'postgres',
  name: 'Postgres',
  icon: postgresIcon,
  itemType: 'document', // todo(nate) whats item type for this app?
  settings: app => <PostgresSettings identifier="postgres" app={app} />,
  setup: PostgresSettings,
  sync: {},
  API: PostgresApi,
})
