import { Connection, createConnection } from 'typeorm'

import { PostgresAppData } from './PostgresModels'
import { AppBit } from '@o/kit'

const connect = (appData: PostgresAppData) => {
  return createConnection({
    name: 'postgres',
    type: 'postgres',
    url: appData.setup.url,
    host: appData.setup.hostname,
    username: appData.setup.username,
    password: appData.setup.password,
    database: appData.setup.database,
    port: appData.setup.port ? parseInt(appData.setup.port) : undefined,
  })
}

export default (app: AppBit<PostgresAppData>) => {
  return {
    async query(query: string, parameters: any[] = []): Promise<any[]> {
      let connection: Connection
      try {
        const appData: PostgresAppData = app.data
        console.log('connecting...')
        connection = await connect(appData)
        console.log('querying...')
        const result = await connection.query(query, parameters)
        console.log('got result yo', result)
        return result
      } catch (err) {
        console.log('error in postgres', err)
      } finally {
        console.log('closing...')
        if (connection) {
          await connection.close()
        }
      }
    },
  }
}