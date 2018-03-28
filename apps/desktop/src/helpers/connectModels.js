import { createConnection } from 'typeorm'

export default async function connectModels(models) {
  try {
    const connection = await createConnection({
      type: 'sqlite',
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
