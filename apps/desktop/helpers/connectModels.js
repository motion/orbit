import { createConnection } from 'typeorm'
import * as Constants from '~/constants'
import Path from 'path'

export default async function connectModels(models) {
  try {
    const connection = await createConnection({
      name: 'default',
      type: 'sqlite',
      database: Path.join(Constants.ROOT_DIR, 'data', 'database'),
      // location: 'default',
      entities: models,
      // logging: true,
      // synchronize: true,
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
