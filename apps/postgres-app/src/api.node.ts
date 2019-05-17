import { createConnection } from 'typeorm'

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
      const appData: PostgresAppData = app.data
      const connection = await connect(appData)
      const result = await connection.query(query, parameters)
      await connection.close()
      return result
    },
  }
}
