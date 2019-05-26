import { Connection, createConnection } from 'typeorm'

import { PostgresAppData } from './PostgresModels'

const connect = (appData: PostgresAppData) => {
  return createConnection({
    name: 'postgres',
    type: 'postgres',
    url: appData.credentials.url,
    host: appData.credentials.hostname,
    username: appData.credentials.username,
    password: appData.credentials.password,
    database: appData.credentials.database,
    port: appData.credentials.port ? parseInt(appData.credentials.port) : undefined,
  })
}

export default (app: any) => {
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
