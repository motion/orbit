import './websqlClient'
import { createConnection } from 'typeorm/browser'

export default async function connectModels(models) {
  try {
    const connection = await createConnection({
      type: 'cordova',
      database: 'database',
      location: 'default',
      entities: models,
      logging: true,
      synchronize: true,
    })
    for (const model of models) {
      console.log('models', models)
      model.useConnection(connection)
    }
  } catch (err) {
    console.log('Error: ', err)
  }
}
