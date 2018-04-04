import { createConnection } from 'typeorm'
import * as Constants from '~/constants'
import Path from 'path'

export default async function connectModels(models) {
  try {
    await createConnection({
      name: 'default',
      type: 'sqlite',
      database: Path.join(Constants.ROOT_DIR, 'data', 'database'),
      // location: 'default',
      entities: models,
      // logging: true,
      autoSchemaSync: true,
      synchronize: true,
    })
  } catch (err) {
    console.log('Error: ', err)
  }
}
