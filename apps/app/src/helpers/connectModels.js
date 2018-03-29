import './websqlClient'
import { createConnection } from 'typeorm/browser'

export default async function connectModels(models) {
  try {
    const connection = await createConnection({
      type: 'cordova',
      database: 'database',
      location: 'default',
      entities: models,
      logging: false,
      synchronize: true,
    })
    for (const model of models) {
      if (model.useConnection) {
        model.useConnection(connection)
      }
    }
  } catch (err) {
    console.log('Error: ', err)
  }
}
