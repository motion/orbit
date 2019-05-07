import { AppBit } from '@o/kit'
import postgraphile from 'postgraphile'

import { PostgresAppData } from './PostgresModels'

export async function graph(app: AppBit<PostgresAppData>) {
  const c = app.data.credentials
  return postgraphile(
    {
      user: c.username,
      host: c.hostname,
      database: c.database,
      password: c.password,
      port: +c.port,
    },
    'public',
    {
      // watchPg: true
    },
  )
}
