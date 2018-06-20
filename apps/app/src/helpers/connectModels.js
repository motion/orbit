import createClient from './websqlClient'
import { createConnection } from 'typeorm/browser'

export default async function connectModels(models) {
  const connect = async () => {
    // reset this on each connect
    const WebSqlClient = createClient()
    window.sqlitePlugin = WebSqlClient.sqlitePlugin

    let started = true
    try {
      let connectTm = setTimeout(() => {
        console.log('took too long, we should handle this: restart desktop?')
      }, 2000)
      const connection = await createConnection({
        type: 'cordova',
        database: 'database',
        location: 'default',
        entities: models,
        // logging: true,
        autoSchemaSync: true,
        synchronize: true,
      })
      clearTimeout(connectTm)
      for (const model of models) {
        model.useConnection(connection)
      }
      WebSqlClient.onError(async err => {
        if (!started) {
          console.log('SQL Error before started', err)
          return
        }
        console.error('SQL Error', err)
        // window.location = window.location
      })
      return connection
    } catch (err) {
      console.log('connectModels Error: ', err)
    }
  }
  return await connect()
}
