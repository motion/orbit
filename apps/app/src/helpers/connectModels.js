import createClient from './websqlClient'
import { createConnection } from 'typeorm/browser'

const originalLocation = window.location

export default async function connectModels(models) {
  window.createConnection = createConnection
  window.models = models

  const connect = async () => {
    console.log('connecting models...')
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
        if (err.message && err.message.indexOf('db not found')) {
          console.log('Reconnecting models...')
          started = false
          // error is here: typeorm wont close...
          // connection.close()
          // // reconnect
          // setTimeout(() => {
          //   connect()
          // }, 1000)
          window.restart()
        }
      })
    } catch (err) {
      console.log('connectModels Error: ', err)
    }
  }
  return await connect()
}
