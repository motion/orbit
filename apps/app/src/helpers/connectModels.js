import createClient from './websqlClient'
import { createConnection } from 'typeorm/browser'

export default async function connectModels(models) {
  const connect = async () => {
    console.log('connecting models...', models)
    // reset this on each connect
    const WebSqlClient = createClient()
    window.sqlitePlugin = WebSqlClient.sqlitePlugin

    let started = true
    try {
      const connection = await createConnection({
        type: 'cordova',
        database: 'database',
        location: 'default',
        entities: models,
        // logging: true,
        autoSchemaSync: true,
        synchronize: true,
      })
      for (const model of models) {
        model.useConnection(connection)
      }
      WebSqlClient.onError(async err => {
        if (!started) {
          return
        }
        console.error('SQL Error', err)
      })
      return connection
    } catch (err) {
      console.log('connectModels Error: ', err)
    }
  }
  return await connect()
}
