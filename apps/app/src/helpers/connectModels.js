import webSqlClient from './websqlClient'
import { createConnection } from 'typeorm/browser'

export default async function connectModels(models) {
  const connect = async () => {
    try {
      await createConnection({
        type: 'cordova',
        database: 'database',
        location: 'default',
        entities: models,
        // logging: true,
        autoSchemaSync: true,
        synchronize: true,
      })
    } catch (err) {
      console.log('Error: ', err)
    }
  }
  webSqlClient.onError(() => {
    console.log('error, reconnecting...')
    connect()
  })
  return await connect()
}
