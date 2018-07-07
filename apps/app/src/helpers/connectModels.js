import { WebSQLClient } from './WebSQLClient'
import { createConnection } from 'typeorm/browser'

export default async function connectModels(models) {
  const connect = async () => {
    const Client = new WebSQLClient()

    // we patch this to get typeorm to communicate with backend
    // see desktop/sqliteServer.ts
    window.sqlitePlugin = Client.getPlugin()

    // ensure on refresh we close out transactions{}
    window.onbeforeunload = () => {
      const locks = Object.keys(Client.txLocks)
        .map(k => Client.txLocks[k])
        .filter(lock => lock.inProgress)
      if (locks.length) {
        console.log('LOCKS STILL ACTIVE', locks, window.lastQueryQueue)
        debugger
      }
    }

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
      Client.onError(async err => {
        if (!started) {
          console.log('SQL Error before started', err)
          return
        }
        console.error('SQL Error', err)
        // temp to debug locks
        console.log('Last query queue:', window.lastQueryQueue)
        // window.location = window.location
      })
      return connection
    } catch (err) {
      console.log('connectModels Error: ', err)
    }
  }
  return await connect()
}
