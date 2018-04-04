import webSqlClient from './websqlClient'
import { createConnection } from 'typeorm/browser'

export default async function connectModels(models) {
  const connect = async () => {
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
      webSqlClient.onError(err => {
        console.log('got a YUGE err, restarting...', err)
        connection.close()
        connect()
      })
    } catch (err) {
      console.log('Error: ', err)
    }
  }
  return await connect()
}
